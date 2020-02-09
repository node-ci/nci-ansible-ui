describe('Build page in general', () => {
	const createBuildParams = {
		projectName: 'some_project',
		branchName: 'master',
		playbookName: 'sample_shell_calls',
		inventories: ['sample'],
		limit: 'some_server_one,some_server_two',
		extraVar: 'someVar=someValue'
	};

	it('create build via api and go to it`s page', () => {
		cy.createAndExpectApiBuild(createBuildParams)
			.then((build) => {
				cy.visitPage('build', {buildId: build.id});
			});
	});

	it('should contain info according to run params', () => {
		cy.expectBuildPageInfo({
			...createBuildParams,
			selectedBuildItemIndex: 0
		});
	});

	it('should contain info about node and initiator', () => {
		cy.contains('.page-header', 'On local node, initiated by httpApi');
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
