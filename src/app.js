const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const csrf = require('csurf');
const cookieParser = require("cookie-parser");

const {
	sessionMiddleware, helmetMiddleware, getRedisClient, corsOptions,
} = require("./app-config");

const sockets = require('./sockets');
const appRoutes = require('./app-routes');

const app = express();

// Middleware function to log requests
app.use((req, res, next) => {
	console.log(`${req.method} request received for ${req.url}`, req.session && req.session.id)
	res.header({"Access-Control-Allow-Origin": "*"});
	next()
});

app.use('/', express.static(path.join(__dirname, 'static')));
app.use(express.text({limit: "200mb"}), express.json({strict: false, limit: "200mb"}));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(helmetMiddleware);
app.use(sessionMiddleware);
// app.use(csrf({ sessionKey: 'sheqaid' }));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms', {
	stream: {
		write: (message) => console.log(message.trim()),
	},
}));

const server = app.listen(process.env.PORT, () => {
	console.log(`server started on port: ${server.address().port}`);
});

appRoutes.start(app);
sockets.start({
	server,
	corsOptions,
	getRedisClient,
	sessionMiddleware,
	helmetMiddleware,
});
