describe('Project run form run with custom revision', () => {
	it('should be loaded by url', () => {
		cy.visit('/projects/run');
		cy.location('pathname')
			.should('equal', '/projects/run');
	});

	const runProjectParams = {
		projectName: 'some_project',
		customRevision: '123',
		playbookName: 'sample_shell_calls',
		inventories: ['sample']
	};

	it('select project, revision, playbook, inventories', () => {
		cy.fillProjectRunForm(runProjectParams);
	});

	it('click on run button', () => {
		cy.get('button:contains(Run):not(.disabled)').click();
	});

	it('should redirect to build page', () => {
		cy.location('pathname')
			.should('match', new RegExp('/builds/\\d+'));
	});

	it('build page should contain info according to run params', () => {
		cy.expectBuildPageInfo(runProjectParams);
	});
});
