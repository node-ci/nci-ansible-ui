describe('Project run form with immediate cancel', () => {
	it('should be loaded by url', () => {
		cy.visit('/projects/run');
		cy.location('pathname').should('equal', '/projects/run');
		// wait to load form elements to have buttons attached to the dom
		cy.contains('label', 'Project')
	});

	it('click on cancel button', () => {
		cy.get('button:contains(Cancel):not(.disabled)').click();
	});

	it('should redirect to build page', () => {
		cy.location('pathname')
			.should('match', new RegExp('/builds/\\d+'));
	});
});
