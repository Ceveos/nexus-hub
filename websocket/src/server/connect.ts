import { Env } from "..";
import { parseMessage } from "../helpers/parseMessage";
import prisma from "../lib/prisma";

export async function serverConnectReq(request: Request, env: Env, ctx: ExecutionContext, path: string[]): Promise<Response> {
  const serverId = path.shift();

  if (!serverId) {
    return new Response("Server ID not provided", { status: 404 });
  }

  const serverData = await prisma(env).server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      community: true,
    }
  });
  
  if (!serverData) {
    return new Response("Server for server not found", { status: 404 });
  }

  if (!serverData.community) {
    return new Response("Community for server not found", { status: 404 });
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
    // switch (message.type) {
    //   case "metadata/response": {
    //     if (!isValidMetadataResponseMessage(message) ||
    //         !Object.values(Game).includes(message.payload.game as Game)) {
    //       console.log(`[server] Received invalid metadata response`);
    //       return;
    //     }

    //     const { payload } = message;
    //     console.log(`[server] Received metadata response from ${community.name} (${community.id})`);
    //     console.log(payload);
    //     const serverId = await registerNewServer(community, {
    //       name: payload.name,
    //       ip: request.headers.get("CF-Connecting-IP") || "localhost",
    //       port: payload.port,
    //       game: payload.game as Game,
    //       gameMode: payload.gameMode,
    //     }, env);

    //     const serverRegisteredMessage: ServerRegisteredMessage = {
    //       type: "server/registered",
    //       version: "1.0.0",
    //       payload: {
    //         serverId: serverId,
    //       }
    //     }

    //     server.send(JSON.stringify(serverRegisteredMessage));
    //     server.close();
    //     break;
    //   }
    //   default: {
    //     console.log(`Unexpected message type: ${message.type}`);
    //   }
    // }
  });

  server.addEventListener('close', async (event) => {
    console.log(`[server] Connection closed with code ${event.code}`);
    server.close();
  });

  server.accept();
  // server.send(JSON.stringify(metadataReq));

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
}