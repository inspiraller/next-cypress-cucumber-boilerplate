import Cypress from 'cypress';

import { Given } from 'cypress-cucumber-preprocessor/steps';

Given(/I have environment variable ('[^\']*')/, (key) => {
  const email = Cypress.env('email');
  expect(email).to.be.a('string');
});
