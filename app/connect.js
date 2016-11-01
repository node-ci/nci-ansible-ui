'use strict';

var socketio = require('socket.io-client'),
	dataio = require('data.io/data.io'),
	io = socketio(),
	data = dataio(io);

/*
 * Extend Resource
 */
var resource = data.resource('__someResource__'),
	resourcePrototype = Object.getPrototypeOf(resource);

resourcePrototype.disconnect = function() {
	this.socket.disconnect();
	this.socket.removeAllListeners();
};

resourcePrototype.connect = function() {
	this.socket.connect();
};

resourcePrototype.reconnect = function() {
	this.disconnect();
	this.connect();
};

module.exports.io = io;
module.exports.data = data;
