describe('Build page run again', () => {
	const createBuildParams = {
		projectName: 'some_project',
		branchName: 'master',
		playbookName: 'sample_shell_calls',
		inventories: ['sample']
	};

	let currentBuildId;
	let newBuildId;

	it('create build via api and go to it`s page', () => {
		cy.createAndExpectApiBuild(createBuildParams)
			.then((build) => {
				currentBuildId = build.id;
				cy.visitPage('build', {buildId: currentBuildId});
			});
	});

	it('click run again and wait for redirect on page of new build', () => {
		cy.get('button:contains(Run again):not(.disabled)').click();
		newBuildId = currentBuildId + 1;
		cy.expectBeOnPage('build', {buildId: newBuildId});
	})

	it('new api build should contain info according to run params', () => {
		cy.getAndExpectApiBuild({
			expectedParams: createBuildParams,
			buildId: newBuildId
		});
	});
});
