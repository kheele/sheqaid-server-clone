const sicknotes = require('./sicknotes');
const api = require('./api');
const {relay, general, views} = require('./graphql');

exports.start = (app) => {
	app.get('/', async (req, res) => {
		res.send('welcome home');
		console.log('welcome home');
	});
	app.use('/api', sicknotes);
	app.use('/api', api);
	app.use('/v1beta1/relay', relay);
	app.use('/v1/graphql', general);
	app.use('/api/rest/views', views);
};