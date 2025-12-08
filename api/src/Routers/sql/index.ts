async function handleRequest(
    request: any,
    env?: any,
    context?: any,
): Promise<any[]> {
    try {
        const expectedToken = env?.SQL_DEBUG_TOKEN || "DEFAULT_TOKEN";
        const requestToken = request.headers.get("X-Debug-Token") ||
            new URL(request.url).searchParams.get("token");
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
        let sql: string | undefined, params: any[] | undefined;
        const url = new URL(request.url);
        if (request.method === "POST") {
            const requestBody = await request.json();
            sql = requestBody.sql;
            params = requestBody.params;
        } else if (request.method === "GET") {
            sql = url.searchParams.get("sql") || "";
        }
        if (!sql) {
            throw new Error("No SQLite statement is provided");
        }
        let stmt;
        if (params) {
            stmt = DB.prepare(sql).bind(...params);
        } else {
            stmt = DB.prepare(sql);
        }
        const { results } = await stmt.all();
        return [
            {
                code: 200,
                message: "Success",
                results,
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
