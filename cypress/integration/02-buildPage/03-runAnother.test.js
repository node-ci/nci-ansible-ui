describe('Build page run another', () => {
	const runProjectParams = {
		projectName: 'some_project',
		branchName: 'master',
		playbookName: 'sample_shell_calls',
		inventories: ['sample']
	};

	it('run project with specified params and wait for build page', () => {
		cy.visitPage('projectRunForm');
		cy.fillProjectRunForm(runProjectParams);
		cy.get('button:contains(Run):not(.disabled)').click();
		cy.expectBeOnPage('build');
	});

	it('should contain info according to run params', () => {
		cy.expectBuildPageInfo({
			...runProjectParams,
			selectedBuildItemIndex: 0
		});
	});

	it('click run another', () => {
		cy.get('button:contains(Run another):not(.disabled)').click();
	})

	it('should redirect to project run form', () => {
		cy.expectBeOnPage('projectRunForm');
	});
});
