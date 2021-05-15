# How to run
```
git clone https://github.com/inspiraller/next-cypress-cucumber-boilerplate.git
```

# cd into repo
```
cd next-cypress-cucumber-boilerplate
```

**cypress/support/step_definitions/steps.ts**
```
import Cypress from 'cypress';

import { Given } from 'cypress-cucumber-preprocessor/steps';

Given(/I have environment variable ('[^\']*')/, (key) => {
  const email = Cypress.env('email');
  expect(email).to.be.a('string');
});
```

# npm install
```
npm i
```
# run dev
```
npm run dev
```
# run test
```
npm run cypress
```

done!!

