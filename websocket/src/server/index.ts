import { Env } from '../env';
import { serverConnectReq } from './connect';
import { serverRegisterReq } from './register';

export async function serverReq(request: Request, env: Env, ctx: ExecutionContext, path: string[]): Promise<Response> {
	const searchParams = new URL(request.url).searchParams;

	const action = searchParams.get('action') ?? request.headers.get('action');

	switch (action) {
		case 'connect':
			return await serverConnectReq(request, env, ctx, searchParams);
		case 'register':
			return await serverRegisterReq(request, env, ctx, searchParams);
		default:
			return new Response('Invalid action', { status: 404 });
	}
}
