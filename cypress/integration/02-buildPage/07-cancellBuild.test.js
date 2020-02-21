describe('Build page сancell build', () => {
	const createBuildParams = {
		projectName: 'long_running_project',
		branchName: 'master',
		playbookName: 'sample_shell_calls',
		inventories: ['sample']
	};

	before(() => {
		cy.createAndExpectApiBuild(createBuildParams).as('build');
	});

	before(function() {
		cy.waitForBuildProps({buildId: this.build.id, props: {status: 'in-progress'}});
		cy.visitPage('build', {buildId: this.build.id});
	});

	it('click on cancell build button at sidebar list at wait for cancell',
		function() {
			// wait for certain build step to cancell
			cy.contains(
				'* run playbook sample_shell_calls with sample inventory',
				{timeout: 10000}
			);
			cy.get('.builds_item__current a:contains(Cancel)').click();
			cy.waitForBuildProps({buildId: this.build.id, props: {status: 'canceled'}});
		}
	);

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
	});

	it('should render cancell label', () => {
		cy.contains(
			'.build-view_terminal .alert-warning',
			'Execution canceled, took'
		);
	});
});
