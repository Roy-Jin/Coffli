async function handleRequest(
    request: any,
    env?: any,
    context?: any,
): Promise<any[]> {
    try {
        const DB = env?.DB;
        const url = new URL(request.url);
        const method = request.method.toUpperCase();

        if (method === "GET") {
            const userId = url.searchParams.get("id");

            if (!userId) {
                return [
                    { error: "Missing user ID" },
                    { status: 400 },
                ];
            }

            try {
                const sql = "SELECT avatar FROM USERS WHERE user_id = ?";
                const enableAvatar = await DB.prepare(sql).bind(userId).first();

                if (!enableAvatar?.avatar) {
                    return [
                        { error: "User not found" },
                        { status: 404 },
                    ];
                }

                if (enableAvatar.avatar) {
                    const sql =
                        "SELECT avatar FROM USERS_AVATAR WHERE user_id = ?";
                    const USERS_AVATAR = await DB.prepare(sql).bind(userId)
                        .first();
                    if (USERS_AVATAR && USERS_AVATAR.avatar) {
                        const { avatar } = USERS_AVATAR;
                        const mimeTypeMatch = avatar.match(
                            /^data:(image\/[a-zA-Z0-9+-.]+);base64,/,
                        );
                        const mimeType = mimeTypeMatch && mimeTypeMatch[1];
                        const headers = {
                            "Content-Type": mimeType || "image/*",
                            "Cache-Control": "public, max-age=31536001",
                        };
                        return [
                            avatar,
                            { headers },
                        ];
                    }
                }

                return [
                    { error: "Avatar not found" },
                    { status: 404 },
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
        } else if (method === "POST") {
            const x_user_id = request.headers.get("X-User-Id");
            const token = request.headers.get("Authorization");
            const requestBody = await request.json();
            const base64Avatar = requestBody.avatar;

            if (!token || !x_user_id) {
                return [
                    {
                        code: 401,
                        message: "Unauthorized",
                    },
                    { status: 401 },
                ];
            }

            const sqlTokenCheck =
                "SELECT token FROM USER_TOKENS WHERE user_id = ? AND token = ?";
            const validToken = await DB.prepare(sqlTokenCheck).bind(
                x_user_id,
                token,
            ).first();

            if (!validToken?.token) {
                return [
                    {
                        code: 401,
                        message: "Unauthorized",
                    },
                    { status: 401 },
                ];
            }

            if (!base64Avatar) {
                return [
                    {
                        code: 400,
                        message: "Missing avatar data",
                    },
                    { status: 400 },
                ];
            }

            const mimeTypeMatch = base64Avatar.match(
                /^data:(image\/[a-zA-Z0-9+-.]+);base64,/,
            );
            if (!mimeTypeMatch) {
                return [
                    {
                        code: 400,
                        message: "Invalid avatar data format",
                    },
                    { status: 400 },
                ];
            }

            const sqlInsertAvatar =
                "INSERT INTO USERS_AVATAR (avatar, user_id, upd_time) VALUES (?, ?, ?)";
            const sqlUpdateUser =
                "UPDATE USERS SET avatar = TRUE WHERE user_id = ?";
            const currentTime = Date.now();

            await DB.prepare(sqlInsertAvatar).bind(
                base64Avatar,
                x_user_id,
                currentTime,
            ).run();
            await DB.prepare(sqlUpdateUser).bind(x_user_id).run();

            return [
                {
                    code: 200,
                    message: "Avatar uploaded successfully",
                },
            ];
        }
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
    return [
        { error: "Unexpected error or unhandled method" },
        { status: 500 },
    ];
}

export default { handleRequest };
