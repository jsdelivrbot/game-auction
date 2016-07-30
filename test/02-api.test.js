/* global describe, it */

let request = require('supertest');
let app = require('../lib/app.js');

request = request(app);

describe('/api', () => {
  it('GET /api/auctions/ - should return 401', (done) => {
    request
      .get('/api/auctions')
      .expect(401)
      .end((err) => {
        if (err) {
          return done(err);
        }

        done();
      });
  });
});