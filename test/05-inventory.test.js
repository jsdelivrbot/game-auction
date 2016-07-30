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

describe('/inventory', () => {
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
        result.should.have.property('id');
        result.should.have.property('token');

        // Test the values make sense
        result.username.should.equal(context.testUser.username);

        context.user = result;

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

        // Test the values make sense
        result.user_id.should.equal(context.user.id);
        result.coins.should.equal(1000);

        context.player = result;

        done();
      });
  });

  it('GET /api/users/:userId/players/:playerId/inventory/:id? — should return 401', (done) => {
    agent
      .get(`/api/users/${context.user.id}/players/${context.player.id}/inventory`)
      .set({
        Authorization: `Bearer wrong_token`
      })
      .expect(401)
      .end((err) => {
        if (err) {
          return done(err);
        }

        done();
      });
  });

  it('GET /api/users/:userId/players/:playerId/inventory/:id? — should return 401', (done) => {
    agent
      .get(`/api/users/${context.player.id+1}/players/${context.player.id}/inventory`)
      .set({
        Authorization: `Bearer ${context.user.token}`
      })
      .expect(403)
      .end((err) => {
        if (err) {
          return done(err);
        }

        done();
      });
  });

  it('GET /api/users/:userId/players/:playerId/inventory/:id? — should return 200 with inventories items', (done) => {
    agent
      .get(`/api/users/${context.user.id}/players/${context.player.id}/inventory`)
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

        let inventory = res.body;

        // Test the attributes exist
        expect(inventory).to.exist;

        // Test the values make sense
        inventory.length.should.equal(3);

        inventory[0].should.have.property('user_id');
        inventory[0].should.have.property('player_id');
        inventory[0].should.have.property('inventory_type_id');
        inventory[0].should.have.property('qty');
        inventory[0].user_id.should.equal(context.user.id);
        inventory[0].player_id.should.equal(context.player.id);

        done();
      });
  });
});