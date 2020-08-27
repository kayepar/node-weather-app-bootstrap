const request = require('supertest');
const app = require('../src/app');

test('Should get main page', async () => {
    await request(app)
        .get('')
        .send()
        .expect(200);
});

test('Should get help page', async () => {
    await request(app)
        .get('/help')
        .send()
        .expect(200);
});

test('Should get about page', async () => {
    await request(app)
        .get('/about')
        .send()
        .expect(200);
});

test('Should get 404 for help subpages', async () => {
    await request(app)
        .get('/help/test')
        .send()
        .expect(404);
});

test('Should get 404 for any non existing page', async () => {
    await request(app)
        .get('/abc')
        .send()
        .expect(404);
});

test('Should not get weather for empty address', async () => {
    const response = await request(app)
        .get('/weather?address=')
        .send()  
        .expect(400);
    expect(response.body.error).toBe('Please provide an address.');
});

test('Should not get weather for invalid address', async () => {
    const response = await request(app)
        .get('/weather?address=!')
        .send()  
        .expect(400);

    expect(response.body.error).toBe('Unable to find location. Try another address.');
});

test('Should get weather for valid address', async () => {
    const response = await request(app)
        .get('/weather?address=manila')
        .send()  
        .expect(200);

    expect(response.body).not.toBeNull();
});