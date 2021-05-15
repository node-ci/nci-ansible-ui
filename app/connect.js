const socketio = require('socket.io-client/dist/socket.io.min.js');
const dataio = require('data.io/data.io');

const io = socketio();
const data = dataio(io);

/*
 * Extend Resource
 */
const resource = data.resource('__someResource__');
const resourcePrototype = Object.getPrototypeOf(resource);

resourcePrototype.disconnect = function () {
	this.socket.disconnect();
	this.socket.removeAllListeners();
};

resourcePrototype.connect = function () {
	this.socket.connect();
};

resourcePrototype.reconnect = function () {
	this.disconnect();
	this.connect();
};

module.exports.io = io;
module.exports.data = data;
