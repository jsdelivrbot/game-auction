1. Steps to install and configure
	- Extract the project in folder
	- Set the project folder current
	- (run in the console:) > npm install
	- (run in the console:) > jspm install
	- start mysql instance and redis instance
	- configure the server settings files: /lib/config/development.js, /lib/config/production.js, /lib/config/test.js

2. Prerequisite Technologies
	- redis-server(running instance is neccessary)
	- mysql-server(running instance is neccessary)
	- babel-cli - (run in the console:) > npm install -g babel-cli
	- nodemon - (run in the console:) > npm install -g nodemon
	- mocha - (run in the console:) > npm install -g mocha

3. Setup the mysql database
	3.1. Create 3 dbs with the names: 'auction', 'auctiontest', 'auctiondev'
		- (run in the MySQL cmd:) > CREATE DATABASE  `auction` ;
		- (run in the MySQL cmd:) > CREATE DATABASE  `auctiondev` ;
		- (run in the MySQL cmd:) > CREATE DATABASE  `auctiontest` ;
	3.2. Configure the db-migrate module in file /migrations/db.json, where you have to enter mysql db settings for production, test and development environment
	3.3. Run the following scripts:
		- (run in the console:) > node node_modules/db-migrate/bin/db-migrate up --config migrations/db.json -e dev
		- (run in the console:) > node node_modules/db-migrate/bin/db-migrate up --config migrations/db.json -e prod
		- (run in the console:) > node node_modules/db-migrate/bin/db-migrate up --config migrations/db.json -e test
	3.4. If there a problem and the creation is not possible by some reason, there are workbench's sql dump files in folder /dump, which could be manually imported via MySQL Workbench Application

4.Run in Development mode
	- configure the server settings file: /lib/config/development.js or run the server with environment variables
	- (run in the console:) > npm start

5. Run in Production mode
	- configure the server settings file: /lib/config/production.js or run the server with environment variables
	- (run in the console:) > npm run bundle
	- (run in the console:) > npm run build
	- (run in the console:) > npm run serve

6. Run tests
	- configure the server settings file: /lib/config/test.js or run the server with environment variables
	- (run in the console:) > npm run test

7. Improving the current implementation - I would like to add password, but this will be pretty easy in regards the my implementation of the task. Also I would like to create a stored procedure for placing a new bid for the current auction, because it the present implementation the find & check & create workflow for adding a new bid is not atomic operation.

8. Not covered requirements - Creation of the docker file. Also when auction reaches his end the winning user's name is not displayed.

9. Node environment variables legend:
	A sample config node env file looks like:

	module.exports = {
	  port: process.env.PORT,
	  secret: process.env.SECRET_TOKEN_STRING,
	  token_expiration: process.env.AUTH_TOKEN_EXP || '1440',
		mysql: {
			host: process.env.SQL_HOST,
			port: process.env.SQL_PORT,
			user: process.env.SQL_USER,
			password: process.env.SQL_PASS,
			database: process.env.SQL_DB || 'auction'
		},
		redis: {
			"port": process.env.REDIS_PORT,
			"host": process.env.REDIS_HOST,
			"family": process.env.REDIS_FAMILY,
			"db": process.env.REDIS_DB
		},
		task_duration: process.env.AUCTION_DURATION || 90,
		task_inc_duration: process.env.AUCTION_INC_DURATION || 10,
		task_wait_duration: process.env.AUCTION_WAIT_DURATION || 10
	}

	Legend
	------
	PORT - number of the port of the node server, e.g. 8000
	SECRET_TOKEN_STRING - random string used for json web token authentication, e.g. 'x123-y321'
	AUTH_TOKEN_EXP - session expiration in minutes, e.g. '1440', which means 24h
	SQL_HOST - sql server - host, e.g. 'localhost'
	SQL_PORT - sql server - port, e.g. '3306'
	SQL_USER - sql server - user, e.g. 'testuser'
	SQL_PASS - sql server - user's password, e.g. 'super_strong_pass'
	SQL_DB - sql server - db name, e.g. 'auctiondev'
	REDIS_PORT - redis server - port, e.g. '6379'
	REDIS_HOST - redis server - host, e.g. '127.0.0.1'
	REDIS_FAMILY - redis server - family, e.g. '0'
	REDIS_DB - redis server - db, e.g. '0'
	AUCTION_DURATION - auction duration, e.g. 90, which means 90 seconds
	AUCTION_INC_DURATION - auction duration being increased with this value, when new bid is placed in the last ten seconds, e.g. 10, which means 10 seconds
	AUCTION_WAIT_DURATION - the duration that the finished auction stays displayed, e.g. 10, which means 10 seconds

10. Additional Functionaly Being Added - Multiple auctions supported in queue; Web sockets authentication; Continue with the last running auction after server being restarted

11. Constructive feedback - I really liked the task :)
