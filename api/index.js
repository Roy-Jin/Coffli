import Router_default from "./Router";
import handleOptions from "./preflight";

export default {
    async fetch(...params) {
        if (params[0].method === "OPTIONS") {
            return handleOptions(...params);
        }
        return Router_default(...params);
    }
};