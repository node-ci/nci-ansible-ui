describe('Build page run another', () => {
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

	it('click run another', () => {
		cy.get('button:contains(Run another):not(.disabled)').click();
	})

	it('should redirect to project run form', () => {
		cy.expectBeOnPage('projectRunForm');
	});
});
