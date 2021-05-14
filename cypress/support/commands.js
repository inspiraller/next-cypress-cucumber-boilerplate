/// <reference types="cypress" />

// debugging 2 of 2
Cypress.Commands.overwrite('log', (subject, message, msg2, msg3) =>
  cy.task('log', message, msg2, msg3)
);
