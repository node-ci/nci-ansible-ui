describe('Build page with success build', () => {
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
		cy.waitForBuildProps({buildId: this.build.id, props: {completed: true}})
			.then((build) => {
				expect(build.error).not.ok;
			});
		cy.visitPage('build', {buildId: this.build.id});
	});

	it('should contain all execution steps', () => {
		cy.contains('Execution steps');
		cy.contains('* prepare executor');
		cy.contains('* get sources');
		cy.contains('* Some action before playbooks');
		cy.contains('* run playbook sample_shell_calls with sample inventory');
		cy.contains('* cleanup executor');
	});

	it('click show console output', () => {
		cy.get('button:contains(Show console output):visible').click();
	});

	it('should render console output with particular commands', () => {
		cy.contains(
			'.build-view_terminal',
			'********* RUN PLAYBOOK SAMPLE_SHELL_CALLS WITH SAMPLE INVENTORY ' +
			'*********'
		);
		cy.contains(
			'.build-view_terminal',
			'JUST ECHO COMMANDS INSTEAD OF EXCUTING THEM: ' +
			'projects/some_project/playbooks/shell/main.yaml ' +
			'--inventory-file=projects/some_project/inventories/sample/hosts'
		);
	});

	it('should render success label', () => {
		cy.contains(
			'.build-view_terminal .alert-success',
			'Execution successfully completed, took'
		);
	});

	it.skip('should not render error', () => {
		cy.contains('failed with error').should('not.exist');
		cy.contains('stderr:').should('not.exist');
	});
});
