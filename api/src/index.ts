import Router_default from "./Router";
import handleOptions from "./Preflight";

export default {
    async fetch(request: any, env?: any, context?: any): Promise<Response> {
        if (request.method === "OPTIONS") {
            return handleOptions();
        }
        return Router_default(request, env, context);
    },
};