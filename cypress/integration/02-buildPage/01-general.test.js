describe('Build page in general', () => {
	const runProjectParams = {
		projectName: 'some_project',
		branchName: 'master',
		playbookName: 'sample_shell_calls',
		inventories: ['sample'],
		limit: 'some_server_one,some_server_two',
		extraVar: 'someVar=someValue'
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

	it('should contain info about node and initiator', () => {
		cy.contains('.page-header', 'On local node, initiated by user');
	});

	it('should contain execution parameters label', () => {
		cy.contains('Execution parameters');
	});

	it('should contain minimal execution steps', () => {
		cy.contains('Execution steps');
		cy.contains('* prepare executor');
		cy.contains('* get sources');
	});

	it('should have enabled run again button', () => {
		cy.get('button:contains(Run again):not(.disabled)');
	});

	it('should have enabled run another button', () => {
		cy.get('button:contains(Run another):not(.disabled)');
	});

	it('should have enabled show console output button', () => {
		cy.get('button:contains(Show console output):not(.disabled)');
	});
});
