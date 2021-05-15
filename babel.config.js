
// console.log(1);
//console.log('process.env.NODE_ENV = ', process.env.NODE_ENV);

// This breaks vscode emmet auto suggest
// if (process.env.NODE_ENV === 'development') {
//   console.log(
//     '########## instrumenting code coverage on starting dev environment #################################################'
//   );
// }

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