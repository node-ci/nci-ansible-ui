describe('Build page with failed build', () => {
	const createBuildParams = {
		projectName: 'fail_project',
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
				expect(build.error).ok;
			});
		cy.visitPage('build', {buildId: this.build.id});
	});

	it('should have error badge at header', () => {
		cy.contains('.page-header .label-danger', 'error');
	});

	it('should contain some execution steps', () => {
		cy.contains('Execution steps');
		cy.contains('* prepare executor');
		cy.contains('* get sources');
		cy.contains('* Some action before playbooks');
		cy.contains('* run playbook sample_shell_calls with sample inventory');
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
			'EXIT with non-zero exit code'
		);
	});

	it('should render error label', () => {
		cy.contains(
			'.build-view_terminal .alert-danger',
			'Execution ended with error, took'
		);
	});

	it('should render error', () => {
		cy.contains(
			'Build step "run playbook sample_shell_calls with sample ' +
			'inventory" failed with error:'
		);
		cy.contains('Error while spawn "/bin/sh -c echo "**');
	});
});
