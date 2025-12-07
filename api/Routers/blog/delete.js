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

        const { blog_id } = await request.json();
        const user = await env.DB.prepare('SELECT user_id FROM USER_TOKENS WHERE user_id = ? token = ?')
            .bind(x_user_id, token)
            .first();

        if (!user?.user_id) {
            return [
                {
                    code: 401,
                    message: 'Unauthorized',
                }, { status: 401 }
            ];
        }

        const result = await env.DB.prepare(
            'DELETE FROM USER_BLOGS WHERE id = ? AND user_id = ?'
        ).bind(blog_id, user.user_id).run();

        if (result.changes === 0) {
            return [
                {
                    code: 404,
                    message: 'Blog not found'
                }, { status: 404 }
            ];
        }

        return [
            {
                code: 200,
                message: 'The blog has been successfully deleted'
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