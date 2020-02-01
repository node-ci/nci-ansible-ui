describe('Project run form run with custom revision', () => {
	it('should be loaded by url', () => {
		cy.visit('/projects/run');
		cy.location('pathname')
			.should('equal', '/projects/run');
	});

	const customRevision = '123';

	it('select project, revision, playbook, inventories', () => {
		cy.fillProjectRunForm({
			projectName: 'some_project',
			customRevision,
			playbookName: 'sample_shell_calls',
			inventories: ['sample']
		});
	});

	it('run button should be enabled', () => {
		cy.get('button:contains(Run):enabled');
	});

	it('click on run button', () => {
		cy.get('button:contains(Run)').click();
	});

	it('should redirect to build page', () => {
		cy.location('pathname')
			.should('match', new RegExp('/builds/\\d+'));
	});

	it('should contain info about target revision', () => {
		cy.contains(`Scm target is ${customRevision}`);
	});
});
