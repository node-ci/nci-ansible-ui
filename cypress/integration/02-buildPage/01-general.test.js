describe('Build page in general', () => {
	const createBuildParams = {
		projectName: 'some_project',
		branchName: 'master',
		playbookName: 'sample_shell_calls',
		inventories: ['sample'],
		limit: 'some_server_one,some_server_two',
		extraVar: 'someVar=someValue'
	};

	before(() => {
		cy.createAndExpectApiBuild(createBuildParams).as('build');
	});

	before(function() {
		cy.waitForBuildProps({buildId: this.build.id, props: {completed: true}});
		cy.visitPage('build', {buildId: this.build.id});
	});

	it('should contain project name at header', () => {
		cy.contains('.page-header', createBuildParams.projectName);
	});

	it('should contain info about node and initiator', () => {
		cy.contains('.page-header', 'On local node, initiated by httpApi');
	});

	it('should have active first item at sidebar list', () => {
		cy.get('.builds_item:eq(0)').should('have.class', 'builds_item__current');
	});

	it('active sidebar item should have project name, exec number', function() {
		cy.contains('.builds_item__current', createBuildParams.projectName);

		cy.getBuildIdFromCurrentUrl().then((buildId) => {
			cy.contains('.builds_item__current a', 'execution')
				.should('have.attr', 'href', `/builds/${buildId}`)
		});
	});

	it('should contain scm target info', () => {
		const {branchName, customRevision} = createBuildParams;
		if (branchName || customRevision) {
			const scmTarget = branchName || customRevision;
			cy.contains('.build-view_info', `Scm target is ${scmTarget}`);
		}
	});

	it('should contain execution parameters label', () => {
		cy.contains('Execution parameters');
	});

	it('should contain playbook name', () => {
		cy.contains(`Playbook: ${createBuildParams.playbookName}`);
	});

	it('should contain target inventories', () => {
		cy.contains(`Inventories: ${createBuildParams.inventories.join(', ')}`);
	});

	it('should contain limit info', () => {
		cy.contains(`Limit: ${createBuildParams.limit}`);
	});

	it('should contain extra vars info', () => {
		cy.contains(`Extra vars: ${createBuildParams.extraVar}`);
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
