import socketio from 'socket.io-client';
import dataio from 'data.io/data.io';

const connect = () => {
	const socket = socketio();
	const data = dataio(socket);

	/*
	 * Extend Resource
	 */
	const resource = data.resource('__someResource__');
	const resourcePrototype = Object.getPrototypeOf(resource);

	if (!resourcePrototype.disconnect) {
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
	}

	return {socket, data};
};

export default connect;
