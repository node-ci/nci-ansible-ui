'use strict';

var _ = require('underscore'),
	fs = require('fs'),
	path = require('path'),
	staticPath = path.join(__dirname, 'static'),
	indexHtml = fs.readFileSync(staticPath + '/index.html');

exports.register = function(originalApp) {
	var app = _(originalApp).clone(),
		socketio = require('socket.io')(app.httpServer);

	app.dataio = require('./dataio')(socketio);

	// init resources
	require('./resources')(app);

	// serve index for all app pages, add this listener after all other
	// listeners
	app.httpServer.addRequestListener(function(req, res, next) {
		if (req.url.indexOf('/data.io.js') === -1) {

			res.setHeader('content-type', 'text/html');
			res.end(indexHtml);
		} else {
			next();
		}
	});
};
