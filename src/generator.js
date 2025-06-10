const fs = require('fs-extra');
const Mustache = require('mustache');

async function generateNode(spec, path, method, nodeName, outputDir = 'generated') {
  if (!spec.paths || !spec.paths[path] || !spec.paths[path][method]) {
    throw new Error('Specified path or method not found in spec');
  }

  const template = await fs.readFile('src/templates/node.mustache', 'utf8');
  const rendered = Mustache.render(template, {
    nodeName,
    method: method.toUpperCase(),
    path,
  });

  const outPath = `${outputDir}/${nodeName}.node.ts`;
  await fs.outputFile(outPath, rendered);
  return outPath;
}

module.exports = { generateNode };
