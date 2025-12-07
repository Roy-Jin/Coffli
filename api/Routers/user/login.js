import bcrypt from 'bcryptjs';

async function handleRequest(request, env) {
    try {
        const DB = env.DB;
        const { id, password } = await request.json();

        if (!id || !password) {
            return [
                {
                    code: 400,
                    message: 'Missing User ID or Password',
                }, { status: 400 }
            ];
        }

        const findUserSql = 'SELECT user_id, password, last_login FROM USERS WHERE user_id = ? AND active = TRUE';
        const user = await DB.prepare(findUserSql).bind(id).first();

        if (!user?.user_id) {
            return [
                {
                    code: 404,
                    message: 'User does not exist',
                }, { status: 404 }
            ];
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return [
                {
                    code: 401,
                    message: 'Incorrect password',
                }, { status: 401 }
            ];
        }

        const lastLoginTime = Date.now();
        const updateLoginSql = 'UPDATE USERS SET last_login = ? WHERE user_id = ?';
        await DB.prepare(updateLoginSql).bind(lastLoginTime, user.user_id).run();

        const token = btoa(user.user_id + '-' + lastLoginTime);
        const deviceInfo = request.headers.get('User-Agent') || 'unknown';
        const insertTokenSql = 'INSERT INTO USER_TOKENS (token, user_id, device_info, login_time) VALUES (?, ?, ?, ?)';
        await DB.prepare(insertTokenSql).bind(token, user.user_id, deviceInfo, lastLoginTime).run();
        const { password: _, ...userInfo } = user;
        userInfo.last_login = lastLoginTime;

        return [
            {
                code: 200,
                message: 'Login successful',
                data: {
                    user: userInfo,
                    token: token,
                },
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