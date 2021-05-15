describe('Project run form with immediate cancel', () => {
	it('should be loaded by url', () => {
		cy.visitPage('projectRunForm');
	});

	it('click on cancel button', () => {
		cy.get('button:contains(Cancel):not(.disabled)').click();
	});

	it('should redirect to build page', () => {
		cy.expectBeOnPage('build');
	});

	it('should be the page of last build', () => {
		let lastBuildId;
		cy.request('/api/0.1/builds?limit=1', {json: true})
			.then((response) => {
				expect(response).an('object');
				expect(response).have.any.key('body');
				expect(response.body).an('object');
				expect(response.body).have.any.key('builds');
				expect(response.body.builds).an('array');
				expect(response.body.builds).length(1);
				lastBuildId = response.body.builds[0].id;
			})
			.then(() => cy.getBuildIdFromCurrentUrl())
			.should((buildId) => {
				expect(buildId).equal(lastBuildId);
			});
	});
});
