// import { PluginConfig } from 'cypress';

const cucumber = require('cypress-cucumber-preprocessor').default;
const browserify = require('@cypress/browserify-preprocessor');

const dotenvPlugin = require('cypress-dotenv');

module.exports = (on, config) => {
  // let config = configRef;
  // config = dotenvPlugin(config);
  // config.env.api_key = process.env.api_key

  // https://github.com/cypress-io/cypress-browserify-preprocessor
  const browserifyOptions = {
    ...browserify.defaultOptions,
    typescript: require.resolve('typescript')
  };
  const brow = browserify(browserifyOptions);
  const cuc = cucumber(browserifyOptions);

  require('@cypress/code-coverage/task')(on, config);

  on('task', {
    log(message) {
      console.log(message);
      return null;
    }
  });

  on('file:preprocessor', (file) => {
    if (file.filePath.includes('.feature')) {
      return cuc(file);
    }
    return brow(file);
  });
  // on('before:browser:launch', (browser = {}, args) => {
  //   if (browser.name === 'chrome') {
  //     args.push('--remote-debugging-port=9222')
  //     return args
  //   }
  // })
  // Also ensure that first page in src/ is index.tsx - not index.js
  return config; // necessary for coverage
};
