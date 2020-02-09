describe('Build page run again', () => {
	const createBuildParams = {
		projectName: 'some_project',
		branchName: 'master',
		playbookName: 'sample_shell_calls',
		inventories: ['sample']
	};

	let currentBuildId;

	it('create build via api and go to it`s page', () => {
		cy.createAndExpectApiBuild(createBuildParams)
			.then((build) => {
				currentBuildId = build.id;
				cy.visitPage('build', {buildId: currentBuildId});
			});
	});

	it('should contain info according to run params', () => {
		cy.expectBuildPageInfo({
			...createBuildParams,
			selectedBuildItemIndex: 0
		});
	});

	it('click run again and wait for redirect on page of new build', () => {
		cy.get('button:contains(Run again):not(.disabled)').click();
		cy.expectBeOnPage('build', {buildId: currentBuildId + 1});				
	})

	it('should contain info according to run params', () => {
		cy.expectBuildPageInfo({
			...createBuildParams,
			selectedBuildItemIndex: 0
		});
	});
});
