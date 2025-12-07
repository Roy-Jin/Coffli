async function handleRequest(request, env) {
    try {
        const x_user_id = request.headers.get('X-User-Id');
        const token = request.headers.get('Authorization');
        if (!token || !x_user_id) {
            return [
                {
                    code: 401,
                    message: 'Unauthorized',
                }, { status: 401 }
            ];
        }

        const user = await env.DB.prepare('SELECT user_id FROM USER_TOKENS WHERE user_id = ? token = ?')
            .bind(x_user_id, token)
            .first();

        if (!user || !user.user_id) {
            return [
                {
                    code: 401,
                    message: 'Unauthorized',
                }, { status: 401 }
            ];
        }

        const { title, content } = await request.json();
        const createdAt = Date.now();

        await env.DB.prepare(
            'INSERT INTO USER_BLOGS (user_id, title, content, created_at) VALUES (?, ?, ?, ?)'
        ).bind(user.user_id, title, content, createdAt).run();

        return [
            {
                code: 200,
                message: 'Blog created successfully'
            }
        ];
    } catch (error) {
        return [
            {
                code: 500,
                message: 'Internal Server Error',
                error: error.message
            }, { status: 500 }
        ];
    }
}

export default { handleRequest };