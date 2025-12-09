async function handleRequest(
    request: any,
    env?: any,
    context?: any,
): Promise<any[]> {
    try {
        const DB = env?.DB;
        const x_user_id = request.headers.get("X-User-Id");
        const token = request.headers.get("Authorization");
        const url = new URL(request.url);
        const userId = url.searchParams.get("id") || x_user_id;

        if (!userId) {
            return [
                {
                    code: 404,
                    message: "User not found",
                },
                { status: 404 },
            ];
        }

        const sql =
            "SELECT user_id, nickname, last_login, role, gender, reg_time, active, avatar, info FROM USERS WHERE user_id = ?";
        const user = await DB.prepare(sql).bind(userId).first();

        if (!user?.user_id) {
            return [
                {
                    code: 404,
                    message: "User not found",
                },
                { status: 404 },
            ];
        }

        if (x_user_id && token && userId === x_user_id) {
            const userToken = await DB.prepare(
                "SELECT user_id FROM USER_TOKENS WHERE user_id = ? AND token = ?",
            ).bind(x_user_id, token).first();

            if (userToken?.user_id) {
                await DB.prepare(
                    "UPDATE USERS SET last_login = ? WHERE user_id = ?",
                ).bind(Date.now(), x_user_id).run();

                user.last_login = Date.now();
            }
        }

        return [
            {
                code: 200,
                message: "User fetched successfully",
                data: user,
            },
        ];
    } catch (error: any) {
        return [
            {
                code: 500,
                message: "Internal Server Error",
                error: error.message,
            },
            { status: 500 },
        ];
    }
}

export default { handleRequest };
