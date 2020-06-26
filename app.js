const _ = require('underscore');
const fs = require('fs');
const path = require('path');

const staticPath = path.join(__dirname, 'static');
const indexHtml = fs.readFileSync(`${staticPath}/index.html`);

exports.register = (originalApp) => {
	const app = _(originalApp).clone();
	const socketio = require('socket.io')(app.httpServer);

	app.dataio = require('./dataio')(socketio);

	// init resources
	require('./resources')(app);

	// serve index for all app pages, add this listener after all other
	// listeners
	app.httpServer.addRequestListener((req, res, next) => {
		if (req.url.indexOf('/data.io.js') === -1) {
			res.setHeader('content-type', 'text/html');
			res.end(indexHtml);
		} else {
			next();
		}
	});
};
