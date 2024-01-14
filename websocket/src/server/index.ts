import { Env } from "..";
import { serverRegisterReq } from "./register";

export async function serverReq(request: Request, env: Env, ctx: ExecutionContext, path: string[]): Promise<Response> {
  switch (path.shift()) {
    case "register":
      return await serverRegisterReq(request, env, ctx, path);
    default:
      return new Response("Not found", {status: 404});
  }
}