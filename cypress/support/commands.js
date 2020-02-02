const _ = require('underscore');

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('visitPage', (pageName) => {
	if (pageName === 'projectRunForm') {
		cy.visit('/projects/run');
	} else {
		throw new Error(`Unknown page name to visit: "${pageName}"`);
	}
	cy.expectBeOnPage(pageName);
});

Cypress.Commands.add('expectBeOnPage', (pageName, options = {}) => {
	if (pageName === 'projectRunForm') {
		cy.location('pathname').should('equal', '/projects/run');
		cy.contains('label', 'Project');
	} else if (pageName === 'build') {
		const pathname = cy.location('pathname');
		if (options.buildId) {
			pathname.should('equal', `/builds/${options.buildId}`);
		} else {
			pathname.should('match', new RegExp('/builds/\\d+'));
		}
	} else {
		throw new Error(`Unknown page name to be on: "${pageName}"`);
	}
});

Cypress.Commands.add('fillProjectRunForm', ({
	projectName,
	branchName,
	customRevision,
	playbookName,
	inventories,
	limit,
	extraVar
}) => {
	if (projectName) {
		cy.get('#project-name').select(projectName);
	}
	if (branchName) {
		cy.get('#scm-branch').select(branchName);
	} else if (customRevision) {
		cy.get('#scm-branch').select('Custom revision');
		cy.get('#scm-branch').siblings('input').type(customRevision);
	}
	if (playbookName) {
		cy.get('#playbook-name').select(playbookName);
	}
	if (inventories) {
		_(inventories).each((inventory) => {
			cy.get(`input[type=checkbox][value=${inventory}]`).check();
		});
	}
	if (limit) {
		cy.get('input#limit').type(limit);
	}
	if (extraVar) {
		cy.get('input#extra-vars').type(extraVar);
	}
});

Cypress.Commands.add('expectBuildPageInfo', ({
	projectName,
	branchName,
	customRevision,
	playbookName,
	inventories,
	limit,
	extraVar,
	selectedBuildItemIndex
}) => {
	if (projectName) {
		cy.contains('.page-header', projectName);
	}
	if (branchName || customRevision) {
		const scmTarget = branchName || customRevision;
		cy.contains('.build-view_info', `Scm target is ${scmTarget}`);
	}
	if (playbookName) {
		cy.contains(`Playbook: ${playbookName}`);
	}
	if (inventories) {
		cy.contains(`Inventories: ${inventories.join(', ')}`);
	}
	if (limit) {
		cy.contains(`Limit: ${limit}`);
	}
	if (extraVar) {
		cy.contains(`Extra vars: ${extraVar}`);
	}
	if (_(selectedBuildItemIndex).isNumber()) {
		cy.get(`.builds_item__current.builds_item:eq(${selectedBuildItemIndex})`);
	}
});
