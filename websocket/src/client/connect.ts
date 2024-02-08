import { Env } from '../env';

export async function clientConnectReq(request: Request, env: Env, ctx: ExecutionContext, searchParams: URLSearchParams): Promise<Response> {
	const newClientId = env.CLIENT.newUniqueId();
	const clientObject = env.CLIENT.get(newClientId);
	return clientObject.fetch(request);
}
