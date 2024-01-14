import { Env } from "..";
import { MetadataRequestMessage } from "~/shared/types/server/registerMessage";
import { parseMessage } from "../helpers/parseMessage";
import { Community, Game } from "@prisma/client";
import prisma from "../lib/prisma";
// import { PrismaClient } from "@prisma/client/edge";

const metadataReq: MetadataRequestMessage = {
  type: "metadata/request",
  version: "1.0.0",
};

export async function serverRegisterReq(request: Request, env: Env, ctx: ExecutionContext, path: string[]): Promise<Response> {
  const communitySecretId = path.shift();

  if (!communitySecretId) {
    return new Response("Community Secret ID not provided", { status: 404 });
  }

  const community = await prisma(env).community.findUnique({
    where: {
      secretId: communitySecretId,
    },
  });
  
  if (!community) {
    return new Response("Community not found", { status: 404 });
  }

  const webSocketPair = new WebSocketPair();
  const [client, server] = Object.values(webSocketPair);

  server.addEventListener('message', (event) => {
    console.log(`[server] Received message ${event}`);
    const message = parseMessage(event);
    if (!message) {
      return;
    }
    switch (message.type) {
      case "metadata/response": {
        const { payload } = message;
        console.log(`[server] Received metadata response from ${community.name} (${community.id})`);
        console.log(payload);
        break;
      }
      default: {
        console.log(`Unexpected message type: ${message.type}`);
      }
    }
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
  game: Game;
  gameMode: string;
}

const registerNewServer = (community: Community, serverData: ServerData, env: Env) => {
  prisma(env).server.create({
    data: {
      name: serverData.name,
      ip: serverData.ip,
      port: serverData.port,
      game: serverData.game,
      gameMode: serverData.gameMode,
      community: {
        connect: {
          id: community.id,
        },
      },
    },
  });
}