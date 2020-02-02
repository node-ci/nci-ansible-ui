describe('Build page show console output', () => {
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

	it('should not render console output and hide console output button', () => {
		cy.get('.build-view_terminal:visible').should('not.exist');
		cy.get('button:contains(Hide console output)').should('not.exist');
	});

	it('click show console output', () => {
		cy.get('button:contains(Show console output):not(.disabled)').click();
	});

	it('should render console output and hide console output button', () => {
		cy.get('.build-view_terminal:visible');
		cy.get('button:contains(Hide console output)');
	});

	it('should not render show console output', () => {
		cy.get('button:contains(Show console output)').should('not.exist');
	});

	it('click hide console output', () => {
		cy.get('button:contains(Hide console output):not(.disabled)').click();
	});

	it('should not render console output and hide console output button', () => {
		cy.get('.build-view_terminal:visible').should('not.exist');
		cy.get('button:contains(Hide console output)').should('not.exist');
	});

	it('should render show console output', () => {
		cy.get('button:contains(Show console output)');
	});
});
