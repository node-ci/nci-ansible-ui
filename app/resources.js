'use strict';

var connect = require('./connect'),
	projects = connect.data.resource('projects'),
	builds = connect.data.resource('builds');

module.exports = {
	projects: projects,
	builds: builds
};
