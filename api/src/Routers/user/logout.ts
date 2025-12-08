async function handleRequest(
    request: any,
    env?: any,
    context?: any,
): Promise<any[]> {
    try {
        const DB = env?.DB;
        const x_user_id = request.headers.get("X-User-Id");
        const token = request.headers.get("Authorization");

        if (!token) {
            return [
                {
                    code: 401,
                    message: "Unauthorized",
                },
                { status: 401 },
            ];
        }
        const deleteTokenSql =
            "DELETE FROM USER_TOKENS WHERE user_id = ? AND token = ?";
        await DB.prepare(deleteTokenSql).bind(x_user_id, token).run();

        return [
            {
                code: 200,
                message: "Logout successful",
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
