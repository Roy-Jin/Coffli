async function handleRequest(
    request: any,
    env?: any,
    context?: any,
): Promise<any[]> {
    try {
        const url = new URL(request.url);
        const blog_id = url.searchParams.get("id");
        if (!blog_id) {
            return [
                {
                    code: 400,
                    message: "Invalid request",
                },
                { status: 400 },
            ];
        }

        const DB = env?.DB;
        const blog = await DB.prepare(
            "SELECT id, user_id, title, content, created_at FROM USER_BLOGS WHERE id = ?",
        ).bind(blog_id).first();

        return [
            {
                code: 200,
                message: "Blog retrieved successfully",
                data: blog,
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
