import socketio from 'socket.io-client';
import dataio from 'data.io/data.io';

export const socket = socketio();
export const data = dataio(socket);

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
