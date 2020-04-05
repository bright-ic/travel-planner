var request = require('supertest');
var app = require('../src/server/server');

describe('The home page route',  () => {
  it("Should return 200 status code", async (done) => {
    let res = await request(app).get('/');
    expect(res.status).toBe(200);
    done();
  });
});