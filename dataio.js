'use strict';

var dataio = require('data.io'),
	Server = require('data.io/lib/server'),
	Resource = require('data.io/lib/resource'),
	Sync = require('data.io/lib/sync');

/*
 * Patch server and resource to provide ability to send data to all clients
 * of the resource
 */

Server.prototype.resource = function(name, resource) {
	var self = this;

	if (resource === undefined) {
		resource = this.resources[name];
		if (resource) return resource;
		resource = new Resource();
	}

	this.resources[name] = resource;

	this.namespace(name).on('connection', function(client) {
		self.connect(resource, client);
	});

	// save link to the namespace at resource
	resource.namespace = this.namespace(name);

	return resource;
};

Resource.prototype.clientEmitSync = function(action, data) {
	this.namespace.emit('sync', action, data);
};

module.exports = function() {
	return dataio.apply(dataio, arguments);
};
