describe('Build page run again', () => {
	const createBuildParams = {
		projectName: 'some_project',
		branchName: 'master',
		playbookName: 'sample_shell_calls',
		inventories: ['sample']
	};

	before(() => {
		cy.createAndExpectApiBuild(createBuildParams).as('build');
	});

	before(function() {
		cy.waitForBuildProps({buildId: this.build.id, props: {completed: true}});
		cy.visitPage('build', {buildId: this.build.id});
	});

	it('click run again and wait for redirect on page of new build', function() {
		cy.get('button:contains(Run again):not(.disabled)').click();
		const newBuildId = this.build.id + 1;
		cy.expectBeOnPage('build', {buildId: newBuildId});
		cy.wrap(newBuildId).as('newBuildId');
	})

	it('new api build should contain info according to run params', function() {
		cy.getAndExpectApiBuild({
			expectedParams: createBuildParams,
			buildId: this.newBuildId
		});
	});
});
