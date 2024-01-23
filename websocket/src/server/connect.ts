import { Env } from '../env';
import { getDurableObjectByName } from '../helpers/objectInteraction';

export async function serverConnectReq(request: Request, env: Env, ctx: ExecutionContext, searchParams: URLSearchParams): Promise<Response> {
	const serverId = searchParams.get('serverId');

	if (!serverId) {
		return new Response('Server ID not provided', { status: 404 });
	}

	const serverObject = getDurableObjectByName('server', serverId, env);
	return serverObject.fetch(request);
}
