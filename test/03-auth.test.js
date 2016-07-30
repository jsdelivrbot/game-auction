/* global describe, it, before, after */

let request = require('supertest');
let app = require('../lib/app.js');
let chai = require('chai');
let expect = chai.expect;
let utils = require('./utils/db.js');

var agent = request.agent(app);
request = request(app);

let context = {};
// Create sample user
context.testUser = {
  username: 'email@example.com'
};

describe('/auth', () => {
  before((done) => {
    utils.cleanDatabase(done);
  });

  //Clean DB after all tests are done
  after((done) => {
    utils.cleanDatabase(done);
  });

  it('GET /verify — should return 401', (done) => {
    agent
      .get('/verify')
      .accept('text/html')
      .expect(401)
      .end((err) => {
        if (err) {
          return done(err);
        }

        done();
      });
  });

  it('POST /auth/login - should return 401', (done) => {
    request
      .post('/auth/login')
      .send({
        username: ''
      })
      .expect(401)
      .end((err) => {
        if (err) {
          return done(err);
        }

        done();
      });
  });

  it('POST /auth/login - should return 401', (done) => {
    request
      .post('/auth/login')
      .expect(401)
      .end((err) => {
        if (err) {
          return done(err);
        }

        done();
      });
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
        result.should.have.property('id');
        result.should.have.property('username');
        result.should.have.property('token');

        // Test the values make sense
        result.username.should.equal(context.testUser.username);

        context.token = result.token;

        done();
      });
  });

  it('POST /auth/logout - should return 200 if the user is logged out', (done) => {
    request.get('/auth/logout')
      .set({
        Authorization: `Bearer ${context.token}`
      })
      .expect(200)
      .end((err) => {
        if (err) {
          return done(err);
        }

        done();
      });
  });

  it('POST /auth/logout - should return 401', (done) => {
    request.get('/auth/logout')
      .expect(401)
      .end((err) => {
        if (err) {
          return done(err);
        }

        done();
      });
  });
});