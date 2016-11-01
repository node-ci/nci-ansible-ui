'use strict';

var React = require('react'),
	template = require('./index.jade'),
	moment = require('moment');

var Component = React.createClass({
	render: template.locals({
		moment: moment
	})
});

module.exports = Component;
