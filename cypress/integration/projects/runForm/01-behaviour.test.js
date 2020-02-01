
describe('Project run form should behave like this', () => {
	it('should be loaded by url', () => {
		cy.visit('/projects/run');
	});

	it('should render project select and cancel, run buttons', () => {
		cy.contains('label', 'Project');
		cy.contains('#project-name', '- select project -');
		cy.contains('button', 'Cancel');
		cy.contains('button', 'Run');
	});

	it('cancel button should be enabled', () => {
		cy.get('button:contains(Cancel):enabled');
	});

	it('run button should be disabled', () => {
		cy.get('button:contains(Run):not(enabled)');
	});

	it('select project some_project', () => {
		cy.get('#project-name').select('some_project');
	});

	it('should render branch and playbook selects', () => {
		cy.contains('label', 'Branch');
		cy.contains('#scm-branch', 'master');
		cy.contains('label', 'Playbook');
		cy.contains('#playbook-name', '- select playbook -');
	});

	it('run button should still be disabled', () => {
		cy.get('button:contains(Run):not(enabled)');
	});

	it('select playbook sample_shell_calls', () => {
		cy.get('#playbook-name').select('sample_shell_calls');
	});

	it('should render inventories, limit, extra var fields', () => {
		cy.contains('label', 'Inventories');
		cy.get('input[type=checkbox][value=sample]');
		cy.contains('label', 'sample');
		cy.contains('a', 'select all inventories');
		cy.contains('label', 'Limit');
		cy.get('input#limit');
		cy.contains('label', 'Extra vars');
		cy.get('input#extra-vars');
	});

	it('select sample inventory', () => {
		cy.get('input[type=checkbox][value=sample]').check();
	});

	it('run button should now be enabled', () => {
		cy.get('button:contains(Run):enabled');
	});
});
