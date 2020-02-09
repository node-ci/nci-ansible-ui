describe('Build page run another', () => {
	const createBuildParams = {
		projectName: 'some_project',
		branchName: 'master',
		playbookName: 'sample_shell_calls',
		inventories: ['sample']
	};

	it('create build via api and go to it`s page', () => {
		cy.createAndExpectApiBuild(createBuildParams)
			.then((build) => {
				cy.visitPage('build', {buildId: build.id});
			});
	});

	it('click run another', () => {
		cy.get('button:contains(Run another):not(.disabled)').click();
	})

	it('should redirect to project run form', () => {
		cy.expectBeOnPage('projectRunForm');
	});
});
