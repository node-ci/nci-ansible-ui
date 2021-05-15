describe('Project run form run with custom revision', () => {
	it('should be loaded by url', () => {
		cy.visitPage('projectRunForm');
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
		cy.expectBeOnPage('build');
	});

	it('api build should contain info according to run params', () => {
		cy.getBuildIdFromCurrentUrl()
			.then((buildId) => {
				cy.getAndExpectApiBuild({
					expectedParams: runProjectParams,
					buildId
				});
			});
	});
});
