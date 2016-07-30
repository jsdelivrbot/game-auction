/* global describe, it */

'use strict';

let request = require('supertest');
let app = require('../lib/app.js');
let chai = require('chai');
let sinonChai = require('sinon-chai');

chai.should();
chai.use(sinonChai);

request = request(app);

describe('server', () => {
	it('should return 200 if home page loads', (done) => {
		request
			.get('/')
			.accept('application/json')
			.expect(200)
			.end(done);
	});
});