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
});
