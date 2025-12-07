import bcrypt from 'bcryptjs';

async function handleRequest(request, env) {
    try {
        const DB = env.DB;
        const info = await request.json();

        if (!info.user_id || !info.password) {
            return [
                {
                    code: 400,
                    message: 'Missing User ID or Password',
                }, { status: 400 }
            ];
        }

        info.password = await bcrypt.hash(info.password, 10);
        info.reg_time = Date.now();
        info.nickname = info.nickname || info.user_id;

        const insertSql = `
            INSERT INTO USERS (${Object.keys(info).join(', ')})
            VALUES (${Object.keys(info).map(() => '?').join(', ')})
        `;
        await DB.prepare(insertSql)
            .bind(...Object.values(info))
            .run();

        return [
            {
                code: 200,
                message: 'Registration successful'
            }
        ];
    } catch (error) {
        if (error.message.includes('UNIQUE')) {
            return [
                {
                    code: 409,
                    message: 'User ID already exists',
                }, { status: 409 }
            ];
        }
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