import { Env } from '../env';
import { ConnectToCommunity, ServerConnection } from '../helpers/communityTypes';
import db from '../lib/db';

export async function serverConnectReq(request: Request, env: Env, ctx: ExecutionContext, path: string[]): Promise<Response> {
	const serverId = path.shift();

	if (!serverId) {
		return new Response('Server ID not provided', { status: 404 });
	}

  const serverData = await db(env).query.servers.findFirst({
    where: (server, {eq}) => eq(server.id, serverId),
    with: {
      community: true
    }
  })

	if (!serverData) {
		return new Response('Server for server not found', { status: 404 });
	}

	if (!serverData.community) {
		return new Response('Community for server not found', { status: 404 });
	}
  
	const serverConnectMessage: ServerConnection = {
		type: 'server',
		id: serverId,
    ip: request.headers.get('CF-Connecting-IP') || 'localhost',
	};

  return await ConnectToCommunity(request, env, serverData.community.id, serverConnectMessage);
}
