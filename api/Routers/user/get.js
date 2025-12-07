async function handleRequest(request, env) {
    try {
        const DB = env.DB;
        const url = new URL(request.url);
        const userId = url.searchParams.get('id');

        const sql = 'SELECT user_id, nickname, last_login, role, gender, reg_time, active, avatar, info FROM USERS WHERE user_id = ?';
        const user = await DB.prepare(sql).bind(userId).first();

        if (!user?.user_id) {
            return [
                {
                    code: 404,
                    message: 'User not found',
                }, { status: 404 }
            ];
        }

        return [
            {
                code: 200,
                message: 'User fetched successfully',
                data: user
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