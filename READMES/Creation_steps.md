# Creation steps

```
npx create-next-app next-cypress-cucumber-boilerplate --use-npm --example with-redux-app
cd next-cypress-cucumber-boilerplate
npm i @types/react @types/node typescript tslib --save-dev
```

### Update version of redux to 4 from this boilerplate - was using 3...
- fix: https://stackoverflow.com/questions/56961024/property-symbol-observable-is-missing-in-type-storeapplicationstate-but
```
npm i redux --save-dev
```

### Add tsconfig.json
```
touch tsconfig.json
```

### install cypress - first to generate folder cypress/
```
npm i cypress --save-dev
```
> troublleshoot - missing folder
```
npx cypress open
```

###  add cross-env for passing NODE_ENV to babel, cypress with typescript, typescript type support, cucumber, coverage with nyc and istanbul, eslint support, webpack to run custom cucumber config, babel configs for fixing cypress preprocessor
```
npm i cross-env @bahmutov/add-typescript-to-cypress @cypress/code-coverage @testing-library/cypress @types/cypress-cucumber-preprocessor cypress-cucumber-preprocessor @istanbuljs/nyc-config-typescript nyc babel-plugin-istanbul istanbul-lib-coverage babel-plugin-transform-class-properties @cypress/browserify-preprocessor --save-dev
```
### create cypress.json targeting cucumber and default environment variable
```json
{
  "baseUrl": "http://localhost:3000",
  "integrationFolder": "cypress/integration",
  "fixturesFolder": "cypress/fixtures",
  "supportFile": "cypress/support/index.js",
  "pluginsFile": "cypress/plugins/index.js",
  "testFiles": "**/*.{feature,features}",
  "viewportWidth": 1428,
  "viewportHeight": 1000,
  "chromeWebSecurity": false,
  "$schema": "https://on.cypress.io/cypress.schema.json",
  "env": {
    "email": "cypress.jsonexample@something.com"
  }
}
```

### Add babel.config.js - to provide coverage for tests
```js
console.log('process.env.NODE_ENV = ', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  console.log(
    '########## instrumenting code coverage on starting dev environment #################################################'
  );
}
module.exports = {
  presets: ['next/babel'],
  env: {
    development: {
      plugins: ['istanbul', 'transform-class-properties']
    },
    production: {
      plugins: ['transform-remove-console']
    }
  },
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        regenerator: true
      }
    ]
  ]
};

```

## update script with cross-env NODE_ENV=development - to ensure babel.config.js picks up development mode for coverage.
**package.json** - script
```
{
  "scripts": {
    "dev": "cross-env NODE_ENV=development next",
  }
}
```


> troubleshoot - missing instrumentation from babel console.log

- solution - clear cache
```
rm -rf .next/cache
```

### npm run dev - will auto generate tsconfig.json (and overwrites existing noEmit to noEmit: true)
```
npm run dev
```

### replace plugins/index.js

**cypress/plugins/index.js**
```js
const cucumber = require('cypress-cucumber-preprocessor').default
const browserify = require('@cypress/browserify-preprocessor');

module.exports = (on, config) => {
  // https://github.com/cypress-io/cypress-browserify-preprocessor
  const browserifyOptions = {
    ...browserify.defaultOptions,
    typescript: require.resolve('typescript')
  };
  const brow = browserify(browserifyOptions)
  const cuc = cucumber(browserifyOptions);

  require('@cypress/code-coverage/task')(on, config);

 // debugging 1 of 2
  on('task', {
    log(message) {
      console.log(message);
      return null;
    }
  });

  on('file:preprocessor', file => {
    if (file.filePath.includes('.feature')) {
      return cuc(file)
    }
    return brow(file)
  })
  return config; // necessary for coverage
}
```

### Replace cypress/commands.js - for debugging purposes
**cypress/commands.js**
```js

// debugging 2 of 2
Cypress.Commands.overwrite('log', (subject, message) =>
  cy.task('log', message)
);
```


### Ensure code coverage in support file
**cypress/support/index.js**
```
import '@cypress/code-coverage/support';
import './commands'
```

### Add script into package.json - to run instrumentation with cypress
**package.json**
```json
{
  scripts: {
   "cypress": "nyc --reporter=text-summary cypress run --headless"
  }
}
```
ready!!
-------------------------------------------------------------------------------------------
# Add first step definition
**cypress/support/step_definitions/steps.ts**
```
import Cypress from 'cypress';

import { Given } from 'cypress-cucumber-preprocessor/steps';

Given(/I have environment variable ('[^\']*')/, (key) => {
  const email = Cypress.env('email');
  expect(email).to.be.a('string');
});
```
> troubleshoot - typescript Property 'env' does not exist on type 'CypressNpmApi
- temporary solution
```
const email = (Cypress.env as any)('email');
```

# Add first feature
**cypress/integration/features/example/env.feature**
```cucumber
Feature: Testing environment variable
  Scenario: Console log environment variable
    Given I have environment variable 'email'
```
-------------------------------------------------------------------------------------------
### Run application then test
```
npm run dev
```
### Test
```
npm run cypress
```
> eror - Cannot read property 'signals' of undefined

## Removing console.log inside babel.config.js fixes emmet???

> error - Cannot read property 'signals' of undefined

-------------------------------------------------------------------------------------
# See creation steps
[Creation Steps](READMES/Creation_steps.md)


# Conclusion - problems to fix
> troubleshoot - typescript Property 'env' does not exist on type 'CypressNpmApi
> trobleshoot - Cannot read property 'signals' of undefined
- fixed - as suggested DO NOT import cypress in steps.ts. Instead include via tsconfig
**cypress/tsconfig.json**
```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "target": "es5",
    "lib": ["es5", "dom"],
    "types": ["cypress"]
  },
  "include": ["**/*.ts"]
}
```

> troubleshoot - vscode auto suggestion not working
- fixed - removed console.log from babel.config.js

> troublshoot - coverage missing
- solution add .nycrc.json
- clear all cache
```
rm -rf .nyc_output
rm -rf node_modules/.cache
rm -rf .next
```
- ensure package.json script
```
    "dev": "cross-env NODE_ENV=development next",
```
- rerun dev  then cypress
```
npm run dev
npm run cypress
```

> troubleshoot - can't find coverage

- solution make sure src/index.tsx not src/index.js - since coverage is only looking for typescript files.
