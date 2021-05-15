const connect = require('./connect');

const projects = connect.data.resource('projects');
const builds = connect.data.resource('builds');

module.exports = {
	projects,
	builds
};
