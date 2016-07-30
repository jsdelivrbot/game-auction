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

context.testUser2 = {
  username: 'email2@example.com'
};

let agent = request.agent(app);
request = request(app);

describe('/auction', function() {
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
      .end((err, res) => {
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

  it('POST /auth/login - should return 200 with user object', (done) => {
    request
      .post('/auth/login')
      .send({
        username: context.testUser2.username
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        let result = res.body;
        context.user2 = result;

        done();
      });
  });

  it('GET /api/users/:userId/players — should return 200 with player object', (done) => {
    agent
      .get(`/api/users/${context.user2.id}/players`)
      .set({
        Authorization: `Bearer ${context.user2.token}`
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        let result = res.body;

        context.player2 = result;

        done();
      });
  });

  it('GET /api/auctions/:auctionId? — should return 401', (done) => {
    agent
      .get(`/api/auctions`)
      .expect(401)
      .end((err) => {
        if (err) {
          return done(err);
        }

        done();
      });
  });

  it('GET /api/auctions/:auctionId? — should return 404', (done) => {
    agent
      .get(`/api/auctions`)
      .set({
        Authorization: `Bearer ${context.user.token}`
      })
      .expect(404)
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
      .end((err, res) => {
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

        context.inventory = inventory[0];

        done();
      });
  });

  it('POST /api/users/:userId/players/:playerId/auctions - should return 400', (done) => {
    agent
      .post(`/api/users/${context.user2.id}/players/${context.player2.id}/auctions`)
      .accept('application/json')
      .set({
        Authorization: `Bearer ${context.user2.token}`
      })
      .send({
        inventoryId: context.inventory.id,
        minPrice: 10
      })
      .expect(400)
      .end((err) => {
        if (err) {
          return done(err);
        }

        done();
      });
  });

  it('POST /api/users/:userId/players/:playerId/auctions - should return 200 if the auction was created', (done) => {
    agent
      .post(`/api/users/${context.user.id}/players/${context.player.id}/auctions`)
      .accept('application/json')
      .set({
        Authorization: `Bearer ${context.user.token}`
      })
      .send({
        inventoryId: context.inventory.id,
        qty: 5,
        minPrice: 10
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        let auction = res.body;

        //Test the attributes exist
        expect(auction).to.exist;
        auction.should.have.property('id');
        auction.should.have.property('inventory_id');
        auction.should.have.property('qty');
        auction.should.have.property('min_price');
        auction.should.have.property('user_id');
        auction.should.have.property('player_id');
        auction.should.have.property('status');

        // Test the values make sense
        auction.status.should.equal('pending');
        auction.inventory_id.should.equal(context.inventory.id);
        auction.qty.should.equal(5);
        auction.min_price.should.equal(10);

        context.auction = auction;

        done();
      });
  });

  it('GET /api/auctions/:auctionId? — should return 200 with auction item', (done) => {
    agent
      .get('/api/auctions')
      .set({
        Authorization: `Bearer ${context.user.token}`
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        let result = res.body;

        // Test the attributes exist
        expect(result).to.exist;

        let auction = res.body;

        // Test the attributes exist
        expect(auction).to.exist;

        done();
      });
  });

  it('PATCH /api/auctions/:auctionId — should return 400', (done) => {
    agent
      .patch(`/api/auctions/${context.auction.id}`)
      .set({
        Authorization: `Bearer ${context.user.token}`
      })
      .send({
        player_id: context.player2.id,
        coins: 5
      })
      .expect(400)
      .end((err) => {
        if (err) {
          return done(err);
        }

        done();
      });
  });

  it('PATCH /api/auctions/:auctionId — should return 200', (done) => {
    agent
      .patch(`/api/auctions/${context.auction.id}`)
      .set({
        Authorization: `Bearer ${context.user.token}`
      })
      .send({
        player_id: context.player2.id,
        coins: 15
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        let result = res.body;

        // Test the attributes exist
        expect(result).to.exist;

        done();
      });
  });

  it('PATCH /api/auctions/:auctionId — should return 400', (done) => {
    agent
      .patch(`/api/auctions/${context.auction.id}`)
      .set({
        Authorization: `Bearer ${context.user.token}`
      })
      .send({
        player_id: context.player2.id,
        coins: -5
      })
      .expect(400)
      .end((err) => {
        if (err) {
          return done(err);
        }

        done();
      });
  });

  it('PATCH /api/auctions/:auctionId — should return 404', (done) => {
    agent
      .patch(`/api/auctions/${context.auction.id+1}`)
      .set({
        Authorization: `Bearer ${context.user.token}`
      })
      .send({
        player_id: context.player2.id,
        coins: 22
      })
      .expect(404)
      .end((err) => {
        if (err) {
          return done(err);
        }

        done();
      });
  });
});