import { Env } from '../env';
import { clientConnectReq } from './connect';

export async function clientReq(request: Request, env: Env, ctx: ExecutionContext, path: string[]): Promise<Response> {
	const searchParams = new URL(request.url).searchParams;

	const action = searchParams.get('action');

	switch (action) {
		case 'connect':
			return await clientConnectReq(request, env, ctx, searchParams);
		default:
			return new Response('Invalid action', { status: 404 });
	}
}
