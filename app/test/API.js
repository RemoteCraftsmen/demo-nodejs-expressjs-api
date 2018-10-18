export default async function setupAPI(authenticated = true) {
    const axios = require('axios');
    const API_URL = 'http://localhost:3000';
    const client = axios.create({ baseURL: API_URL });
    let token;

    if (authenticated) {
        const user = {
            username: 'uname',
            first_name: 'fname',
            last_name: 'lname',
            email: `me@me${new Date().getTime()}.com`,
            password: '123456'
        };

        const { data } = await client.post('/users', user);
        token = data.token;

        client.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    }

    return { client, token };
}
