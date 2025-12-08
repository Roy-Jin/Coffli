import Response_default from "./Response";

import _init from "./Routers/init/index";
import _root from "./Routers/root/index";
import _sql from "./Routers/sql/index";
import _help from "./Routers/help/index";
import _user_avatar from "./Routers/user/avatar";
import _user_register from "./Routers/user/register";
import _user_get from "./Routers/user/get";
import _user_login from "./Routers/user/login";
import _user_logout from "./Routers/user/logout";
import _user_update from "./Routers/user/update";
import _blog_get from "./Routers/blog/get";
import _blog_create from "./Routers/blog/create";
import _blog_delete from "./Routers/blog/delete";

interface RouterHandler {
    handleRequest(request: Request, env?: any, context?: any): Promise<any[]>;
}

interface RouterItem {
    path: string;
    handler: RouterHandler;
}

const RoutersList: RouterItem[] = [
    { path: "/", handler: _root },
    { path: "/init", handler: _init },
    { path: "/sql", handler: _sql },
    { path: "/help", handler: _help },
    // user router
    { path: "/user/avatar", handler: _user_avatar },
    { path: "/user/register", handler: _user_register },
    { path: "/user/logout", handler: _user_logout },
    { path: "/user/get", handler: _user_get },
    { path: "/user/login", handler: _user_login },
    { path: "/user/update", handler: _user_update },
    // blog router
    { path: "/blog/get", handler: _blog_get },
    { path: "/blog/create", handler: _blog_create },
    { path: "/blog/delete", handler: _blog_delete },
];

async function Router_default(
    request: Request,
    env?: any,
    context?: any,
): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    try {
        const disable = env?.DISABLE_ROUTERS || [];
        const router2 = RoutersList.find((item) => item.path === path);
        if (router2 && !disable.includes(path)) {
            const handler = router2.handler;
            const res = await handler.handleRequest(request, env, context);
            return Response_default(res[0], res[1]);
        } else {
            return Response_default(
                { message: "404 Not Found", code: 404, path: path },
                { status: 404 },
            );
        }
    } catch (error: any) {
        return Response_default(error.message, { status: 500 });
    }
}

export default Router_default;
