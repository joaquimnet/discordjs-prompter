/* eslint-disable @typescript-eslint/no-var-requires */
const TypeDoc = require('typedoc');
const path = require('path');
const rimraf = require('rimraf');

const app = new TypeDoc.Application({
  mode: 'File',
  exclude: '**/util/**',
  target: 'ES6',
  module: 'ESNext',
  ignoreCompilerErrors: true,
  // experimentalDecorators: true,
  moduleResolution: 'node',
  externalPattern: '**/util/**',
});

const project = app.convert([path.resolve(__dirname, './src/index.ts')]); //(app.expandInputFiles(['src']));

if (project) {
  // Project may not have converted correctly
  const outputDir = 'docs';

  rimraf('./docs', () => {
    // Rendered docs
    app.generateDocs(project, outputDir);
    // Alternatively generate JSON output
    // app.generateJson(project, outputDir + '/documentation.json');
  });
}
