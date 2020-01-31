const {getServerUrl} = require('../../utils');

describe('Project run form should behave like this', () => {
	it('should be loaded by url', () => {
		const runFormUrl = getServerUrl('/projects/run');

		cy.visit(runFormUrl);
	});

	it('should render project selector and cancel, run buttons', () => {
		cy.contains('label', 'Project');
		cy.contains('select', '- select project -');
		cy.contains('button', 'Cancel');
		cy.contains('button', 'Run');
	});

	it('cancel button should be enabled', () => {
		cy.get('button:contains(Cancel):enabled');
	});

	it('run button should be disabled', () => {
		cy.get('button:contains(Run):not(enabled)');
	});
});
