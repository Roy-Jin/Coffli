async function handleRequest(request, env) {
    try {
        const x_user_id = request.headers.get('X-User-Id');
        const token = request.headers.get('Authorization');

        if (!x_user_id || !token) {
            return [
                { code: 401, message: 'Unauthorized' },
                { status: 401 }
            ];
        }

        const userToken = await env.DB.prepare(
            'SELECT user_id FROM USER_TOKENS WHERE user_id = ? AND token = ?'
        ).bind(x_user_id, token).first();

        if (!userToken?.user_id) {
            return [
                { code: 401, message: 'Unauthorized' },
                { status: 401 }
            ];
        }

        const { nickname, gender, info } = await request.json();
        const updateFields = [];
        const bindParams = [];

        if (nickname !== undefined) {
            updateFields.push('nickname = ?');
            bindParams.push(nickname);
        }

        if (gender !== undefined) {
            updateFields.push('gender = ?');
            bindParams.push(gender);
        }

        if (info !== undefined) {
            updateFields.push('info = ?');
            bindParams.push(JSON.stringify(info));
        }

        if (updateFields.length === 0) {
            return [
                { code: 400, message: 'No valid fields to update' },
                { status: 400 }
            ];
        }

        const sql = `UPDATE USERS SET ${updateFields.join(', ')} WHERE user_id = ?`;
        bindParams.push(x_user_id);

        await env.DB.prepare(sql).bind(...bindParams).run();

        return [
            { code: 200, message: 'User information updated successfully' }
        ];
    } catch (error) {
        return [
            { code: 500, message: 'Internal Server Error', error: error.message },
            { status: 500 }
        ];
    }
}

export default { handleRequest };