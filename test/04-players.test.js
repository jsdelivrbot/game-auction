/* global describe, it, before, after */

let request = require('supertest');
let app = require('../lib/app.js');
let chai = require('chai');
let sinonChai = require('sinon-chai');
let expect = chai.expect;
let utils = require('./utils/db.js');

chai.should();
chai.use(sinonChai);

let context = {};
// Create sample user
context.testUser = {
  username: 'email@example.com'
};

let agent = request.agent(app);
request = request(app);

describe('/players', () => {
  before((done) => {
    utils.cleanDatabase(done);
  });

  //Clean DB after all tests are done
  after((done) => {
    utils.cleanDatabase(done);
  });

  it('POST /auth/login - should return 200 with user object', (done) => {
    request
      .post('/auth/login')
      .send({
        username: context.testUser.username
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        let result = res.body;

        // Test the attributes exist
        expect(result).to.exist;
        result.should.have.property('token');

        // Test the values make sense
        result.username.should.equal(context.testUser.username);

        context.user = result;

        done();
      });
  });

  it('GET /api/users/:userId/players — should returns 401', (done) => {
    agent
      .get(`/api/users/${context.user.id+1}/players`)
      .expect(401)
      .end(function(err) {
        if (err) {
          return done(err);
        }

        done();
      });
  });

  it('GET /api/users/:userId/players — should return 200 with player object', (done) => {
    agent
      .get(`/api/users/${context.user.id}/players`)
      .set({
        Authorization: `Bearer ${context.user.token}`
      })
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        let result = res.body;

        // Test the attributes exist
        expect(result).to.exist;
        result.should.have.property('id');
        result.should.have.property('user_id');
        result.should.have.property('coins');

        // Test the values make sense
        result.user_id.should.equal(context.user.id);
        result.coins.should.equal(1000);

        context.player = result;

        done();
      });
  });
});