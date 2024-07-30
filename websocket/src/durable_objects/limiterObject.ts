import { Env } from '../env';
import handleErrors from '../helpers/handleErrors';

export class LimiterObject implements DurableObject {
    state: DurableObjectState;
    storage: DurableObjectStorage;
    env: Env;

    constructor(state: DurableObjectState, env: Env) {
        this.state = state;
        this.storage = state.storage;
        this.env = env;

        this.state.getWebSockets().forEach((webSocket) => {
            const meta = webSocket.deserializeAttachment();
        });
    }

    async fetch(request: Request) {
        return await handleErrors(request, async () => {
            return new Response(null, { status: 101 });
        });
    }
}
