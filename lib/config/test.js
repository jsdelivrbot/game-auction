module.exports = {
  port: process.env.PORT || 8000,
  secret: process.env.SECRET_TOKEN_STRING || 'x123-y321',
  token_expiration: process.env.AUTH_TOKEN_EXP || '1440',
	mysql: {
		host: process.env.SQL_HOST,
		port: process.env.SQL_PORT,
		user: process.env.SQL_USER,
		password: process.env.SQL_PASS,
		database: process.env.SQL_DB || 'auctiontest'
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