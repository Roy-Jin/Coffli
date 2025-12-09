async function handleRequest(
    request: any,
    env?: any,
    context?: any,
): Promise<any[]> {
    try {
        const expectedToken = env?.SQL_DEBUG_TOKEN || "DEFAULT_TOKEN";
        const requestToken = request.headers.get("X-Debug-Token") ||
            new URL(request.url).searchParams.get("token");
        const forceInit =
            new URL(request.url).searchParams.get("force") === "true";
        if (!expectedToken || requestToken !== expectedToken) {
            return [
                {
                    code: 401,
                    message: "Unauthorized",
                },
                { status: 401 },
            ];
        }

        const DB = env?.DB;

        if (forceInit) {
            const dropSql = `
                DROP TABLE IF EXISTS USERS_AVATAR;
                DROP TABLE IF EXISTS USER_TOKENS;
                DROP TABLE IF EXISTS USER_BLOGS;
                DROP TABLE IF EXISTS USERS;
            `;
            await DB.prepare(dropSql).run();
        }

        const sql = `
            CREATE TABLE IF NOT EXISTS USERS (
                avatar TEXT,
                nickname TEXT,
                last_login INTEGER,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'USER',
                gender INTEGER DEFAULT 3,
                reg_time INTEGER NOT NULL,
                active BOOLEAN DEFAULT TRUE,
                user_id TEXT COLLATE NOCASE UNIQUE PRIMARY KEY,
                info TEXT DEFAULT '{"ip": "", "email": "", "phone": "", "birthday": "", "bio": ""}'
            );

            CREATE TABLE IF NOT EXISTS USER_TOKENS (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                token TEXT NOT NULL,
                user_id TEXT NOT NULL,
                device_info TEXT,
                login_time INTEGER NOT NULL,
                FOREIGN KEY(user_id) REFERENCES USERS(user_id)
            );

            CREATE TABLE IF NOT EXISTS USER_BLOGS (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at INTEGER NOT NULL,
                FOREIGN KEY(user_id) REFERENCES USERS(user_id)
            );
        `;
        await DB.prepare(sql).run();
        return [
            {
                code: 200,
                message: `${
                    forceInit ? "The forced i" : "I"
                }nitialization of the database is successful`,
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
