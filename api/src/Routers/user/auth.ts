async function handleRequest(
    request: any,
    env?: any,
    context?: any,
): Promise<any[]> {
    try {
        const DB = env?.DB;
        const x_user_id = request.headers.get("X-User-Id");
        const token = request.headers.get("Authorization");

        if (!x_user_id || !token) {
            return [
                {
                    code: 400,
                    message: "Invalid request",
                },
                { status: 400 },
            ];
        }

        const userToken = await env?.DB.prepare(
            "SELECT user_id FROM USER_TOKENS WHERE user_id = ? AND token = ?",
        ).bind(x_user_id, token).first();

        if (!userToken?.user_id) {
            return [
                { code: 401, message: "Unauthorized" },
                { status: 401 },
            ];
        }

        return [
            {
                code: 200,
                message: "Authenticated",
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
