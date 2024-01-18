import { Env } from '../env';
import { MetadataRequestMessage, ServerRegisteredMessage, isValidMetadataResponseMessage } from '~/shared/types/server/registerMessage';
import { parseMessage } from '../helpers/parseMessage';
import db from '../lib/db';
import { Community, Game, NewServer, servers } from '~/shared/db/schema';

const metadataReq: MetadataRequestMessage = {
	type: 'metadata/request',
	version: '1.0.0',
};

export async function serverRegisterReq(request: Request, env: Env, ctx: ExecutionContext, path: string[]): Promise<Response> {
	const communitySecretId = path.shift();

	if (!communitySecretId) {
		return new Response('Community Secret ID not provided', { status: 404 });
	}

	const community = await db(env).query.communities.findFirst({
		where: (community, { eq }) => eq(community.secretId, communitySecretId),
	});

	if (!community) {
		return new Response('Community not found', { status: 404 });
	}

	const webSocketPair = new WebSocketPair();
	const [client, server] = Object.values(webSocketPair);

	server.addEventListener('message', async (event) => {
		const message = parseMessage(event);
		if (!message) {
			console.log(`[server] Received unknown message`);
			console.log(JSON.stringify(message));
			return;
		}
		switch (message.type) {
			case 'metadata/response': {
				if (!isValidMetadataResponseMessage(message)) {
					console.log(`[server] Received invalid metadata response`);
					server.close(1002, 'Invalid metadata response');
					return;
				}

				const { payload } = message;
				console.log(`[server] Received metadata response from ${community.name} (${community.id})`);
				console.log(payload);
				const serverId = await registerNewServer(
					community,
					{
						name: payload.name,
						ip: request.headers.get('CF-Connecting-IP') || 'localhost',
						port: payload.port,
						game: payload.game,
						gameMode: payload.gameMode,
					},
					env,
				);

				const serverRegisteredMessage: ServerRegisteredMessage = {
					type: 'server/registered',
					version: '1.0.0',
					payload: {
						serverId: serverId,
					},
				};

				server.send(JSON.stringify(serverRegisteredMessage));
				server.close();
				break;
			}
			default: {
				console.log(`Unexpected message type: ${message.type}`);
			}
		}
	});

	server.addEventListener('close', async (event) => {
		console.log(`[server] Connection closed with code ${event.code}`);
		server.close();
	});

	server.accept();
	server.send(JSON.stringify(metadataReq));

	return new Response(null, {
		status: 101,
		webSocket: client,
	});
}

interface ServerData {
	name: string;
	ip: string;
	port: number;
	game: (typeof Game[number]);
	gameMode: string;
}

const registerNewServer = async (community: Community, serverData: ServerData, env: Env): Promise<string> => {
	const server = await db(env).query.servers.findFirst({
		where: (server, { and, eq }) => and(eq(server.ip, serverData.ip), eq(server.port, serverData.port), eq(server.game, serverData.game)),
	});

	if (server) {
		console.log(`[server] Server already registered`);
		return server.id;
	}

	console.log(`[server] Registering new server`);
	const result = await db(env).insert(servers).values(
    {
      ...serverData,
      communityId: community.id,
      updatedAt: new Date(),
    }
  ).returning();

	console.log(`[server] Server registered: `, result[0].id);
	return result[0].id;
};
