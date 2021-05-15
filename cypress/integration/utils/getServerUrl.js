const urlJoin = require('url-join');

const { _ } = Cypress;

const baseUrl = 'http://127.0.0.1:3000';

module.exports = (...args) => {
	return urlJoin.apply(
		urlJoin,
		[baseUrl].concat(args || [])
	);
};