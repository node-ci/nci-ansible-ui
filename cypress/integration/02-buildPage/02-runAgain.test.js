describe('Build page run again', () => {
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

	let currentBuildId;

	it('get current build id from url', () => {
		cy.location('pathname').should((pathname) => {
			const parts = new RegExp('^/builds/(\\d+)').exec(pathname);
			const buildId = parts ? Number(parts[1]) : null;
			if (!buildId) {
				throw new Error(`Can't get build id from path: "${pathname}"`);
			}
			currentBuildId = buildId;
		});
	});

	it('click run again and wait for redirect on page of new build', () => {
		cy.get('button:contains(Run again):not(.disabled)').click();
		cy.expectBeOnPage('build', {buildId: currentBuildId + 1});				
	})

	it('should contain info according to run params', () => {
		cy.expectBuildPageInfo({
			...runProjectParams,
			selectedBuildItemIndex: 0
		});
	});
});
