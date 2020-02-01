describe('Project run form run with branch', () => {
	it('should be loaded by url', () => {
		cy.visit('/projects/run');
		cy.location('pathname')
			.should('equal', '/projects/run');
	});

	const branchName = 'master';

	it('select project, branch, playbook, inventories', () => {
		cy.fillProjectRunForm({
			projectName: 'some_project',
			branchName,
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

	it('should contain info about target branch', () => {
		cy.contains(`Scm target is ${branchName}`);
	});
});
