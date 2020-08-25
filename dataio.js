const dataio = require('data.io');
const Server = require('data.io/lib/server');
const Resource = require('data.io/lib/resource');

/*
 * Patch server and resource to provide ability to send data to all clients
 * of the resource
 */

Server.prototype.resource = function (name, resource) {
	const self = this;

	if (resource === undefined) {
		resource = this.resources[name];
		if (resource) return resource;
		resource = new Resource();
	}

	this.resources[name] = resource;

	this.namespace(name).on('connection', (client) => {
		self.connect(resource, client);
	});

	// save link to the namespace at resource
	resource.namespace = this.namespace(name);

	return resource;
};

Resource.prototype.clientEmitSync = function (action, data) {
	this.namespace.emit('sync', action, data);
};

module.exports = function (...args) {
	return dataio.apply(dataio, args);
};
