
const helmet = require('helmet');
const {createCluster, createClient} = require("redis");
const session = require("express-session");
const RedisStore = require("connect-redis").default;

const {COOKIE_SECRET, ENVIRONMENT, ENDPOINT_REDIS } = process.env;

const redisClient = createClient({ url: ENDPOINT_REDIS });
const pubClient = createClient({ url: ENDPOINT_REDIS });
const subClient = pubClient.duplicate();

const redisConnect = () => {
	redisClient.connect().then(res => {
		console.log('redisConnect success');
	}).catch(err => {
		console.error('redisConnect error:', err);
		redisConnect();
	});
};

redisConnect();

const sessionMiddleware = session({
	secret: COOKIE_SECRET,
	credentials: true,
	name: "sid",
	store: new RedisStore({ client: redisClient }),
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: ENVIRONMENT === "production" ? "true" : "auto",
		httpOnly: true,
		expires: 1000 * 60 * 60 * 24 * 7,
		sameSite: ENVIRONMENT === "production" ? "none" : "lax",
	},
});

const corsOptions = {
	origin: "*",
	credentials: "true",
};

const helmetMiddleware = helmet();

const getRedisClient = () => ({pubClient, subClient});

module.exports = { sessionMiddleware, helmetMiddleware, getRedisClient, corsOptions, };
