const React = require('react');
const moment = require('moment');
const template = require('./index.jade');

const Component = React.createClass({
	render: template.locals({
		moment
	})
});

module.exports = Component;
