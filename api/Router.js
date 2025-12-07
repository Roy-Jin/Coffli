import Response_default from "./Response.js";

import _init from "./Routers/init/index.js";
import _root from "./Routers/root/index.js";
import _sql from "./Routers/sql/index.js";
import _help from "./Routers/help/index.js";
import _user_avatar from "./Routers/user/avatar.js";
import _user_register from "./Routers/user/register.js";
import _user_get from "./Routers/user/get.js";
import _user_login from "./Routers/user/login.js";
import _user_logout from "./Routers/user/logout.js";
import _blog_get from "./Routers/blog/get.js";
import _blog_create from "./Routers/blog/create.js";
import _blog_delete from "./Routers/blog/delete.js";

const RoutersList = [
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
    // blog router
    { path: "/blog/get", handler: _blog_get },
    { path: "/blog/create", handler: _blog_create },
    { path: "/blog/delete", handler: _blog_delete },
];
async function Router_default(...Params) {
    const [request, env] = Params;
    const url = new URL(request.url);
    const path = url.pathname;
    try {
        const disable = env.DISABLE_ROUTERS || [];
        const router2 = RoutersList.find((item) => item.path === path);
        if (router2 && !disable.includes(path)) {
            const handler = router2.handler;
            const res = await handler.handleRequest(...Params);
            return Response_default(...res);
        } else {
            return Response_default(
                { message: "404 Not Found", code: 404, path: path },
                { status: 404 }
            );
        }
    } catch (error) {
        return Response_default(error.message, { status: 500 });
    }
}

export default Router_default;
