export default async function setupAPI(request) {
    const user = {
        username: 'uname',
        first_name: 'fname',
        last_name: 'lname',
        email: `me@me${new Date().getTime()}.com`,
        password: '123456'
    };

    let response = await request
        .post('/users')
        .send(user);

    return response.body.token;
}
