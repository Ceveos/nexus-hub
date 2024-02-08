import { Env } from "../env";
import { MetadataInvalidMessage, MetadataRequestMessage, ServerRegisteredMessage, isValidMetadataResponseMessage } from "~/shared/types/server/registerMessage";
import { parseMessage } from "../helpers/parseMessage";
import { Community, Game } from "@prisma/client";
import prisma from "../lib/prisma";

const requestMetadataMessage: MetadataRequestMessage = {
  payload: {
    action: 'metadata/request'
  },
  version: '1.0.0'
}

const invalidMetadataMessage: MetadataInvalidMessage = {
  payload: {
    action: 'metadata/invalid'
  },
  version: '1.0.0'
}


export async function serverRegisterReq(request: Request, env: Env, ctx: ExecutionContext, searchParams: URLSearchParams): Promise<Response> {
  const communitySecret = searchParams.get('communitySecret') ?? request.headers.get('communitySecret');

  if (!communitySecret) {
    return new Response("Community Secret ID not provided", { status: 404 });
  }

  const community = await prisma(env).community.findUnique({
    where: {
      secret: communitySecret,
    },
  });
  
  if (!community) {
    return new Response("Community not found", { status: 404 });
  }

  const webSocketPair = new WebSocketPair();
  const [client, server] = Object.values(webSocketPair);

  server.addEventListener('message', async (event) => {
    const message = parseMessage(event);
    if (!message) {
      console.log(`[server] Received unknown message`);
      console.log(JSON.stringify(message))
      return;
    }
    switch (message.payload?.action) {
      case "metadata/response": {
        if (!isValidMetadataResponseMessage(message) ||
            !Object.values(Game).includes(message.payload.data.game as Game)) {
          console.log(`[server] Received invalid metadata response`);
          server.send(JSON.stringify(invalidMetadataMessage));
          return;
        }

        const { data } = message.payload;
        console.log(`[server] Received metadata response from ${community.name} (${community.id})`);
        console.log(data);
        const serverId = await registerNewServer(community, {
          name: data.name,
          ip: request.headers.get("CF-Connecting-IP") || "localhost",
          port: data.port,
          game: data.game as Game,
          gameMode: data.gameMode,
        }, env);

        const serverRegisteredMessage: ServerRegisteredMessage = {
          version: "1.0.0",
          payload: {
            action: "registered",
            data: {
              serverId: serverId,
            }
          }
        }

        server.send(JSON.stringify(serverRegisteredMessage));
        server.close();
        break;
      }
      default: {
        console.log(`Unexpected message action: ${message.payload?.action}`);
      }
    }
  });

  server.addEventListener('close', async (event) => {
    console.log(`[server] Connection closed with code ${event.code}`);
    server.close();
  });

  console.log(`[server] Sending metadata request`, JSON.stringify(requestMetadataMessage));

  server.accept();
  server.send(JSON.stringify(requestMetadataMessage));

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
}

interface ServerData {
  name: string;
  ip: string;
  port: number;
  game: Game;
  gameMode: string;
}

const registerNewServer = async (community: Community, serverData: ServerData, env: Env): Promise<string> => {
  const server = await prisma(env).server.findFirst({
    where: {
      game: serverData.game,
      ip: serverData.ip,
      port: serverData.port,
    },
  });

  if (server) {
    console.log(`[server] Server already registered`);
    return server.id;
  }

  const result = await prisma(env).server.create({
    data: {
      ...serverData,
      community: {
        connect: {
          id: community.id,
        },
      },
    },
  });

  console.log(`[server] Server registered: `, result.id);
  return result.id;
}