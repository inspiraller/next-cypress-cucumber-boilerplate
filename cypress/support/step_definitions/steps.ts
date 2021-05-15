// import Cypress from 'cypress';

import { Given } from 'cypress-cucumber-preprocessor/steps';

Given(/I have environment variable '([^\']*)'/, (key) => {
  const value = Cypress.env(key);
  expect(value).to.be.a('string');
});
Given(/I visit \'([^\']+)\'/, (url) => {
  cy.visit(url);
});
Given(/element '([^\']*)' exists/, (elem) => {
  cy.task('log', `elem='${elem}'`)
  cy.get(elem).should('be.visible');
});
