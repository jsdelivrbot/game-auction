# Game auction application

## Prerequisite Technologies
- redis-server
- mysql-server
- babel-cli
- nodemon
- mocha

## Installation

```
npm install
jspm install
```

## Usage

### Run in Development mode

```
npm start
```

### Run in Production mode

```
npm run bundle
npm run build
npm run serve
```

### Run tests

```
npm run test
```

## Config files

### Configuration

- /lib/config/development.js
- /lib/config/production.js
- /lib/config/test.js

``` javascript
{
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

## DB migrations files - /dump folder

The db migrations config file - /migrations/db.json

### Create db migration script

```
node node_modules/db-migrate/bin/db-migrate --config migrations/db.json -e {{dev|prod|test}} create {{description}} --sql-file
```

### Run db migrations UP

```
node node_modules/db-migrate/bin/db-migrate up --config migrations/db.json -e {{dev|prod|test}}
```

### Run db migrations DOWN

```
node node_modules/db-migrate/bin/db-migrate down --config migrations/db.json -e {{dev|prod|test}}
```
