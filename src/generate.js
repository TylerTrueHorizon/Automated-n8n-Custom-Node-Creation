const fs = require('fs-extra');
const { generateNode } = require('./generator');

async function main() {
  const specPath = process.argv[2];
  if (!specPath) {
    console.error('Usage: node src/generate.js <openapi.json>');
    process.exit(1);
  }
  const spec = await fs.readJson(specPath);
  const pathEntry = Object.entries(spec.paths)[0];
  if (!pathEntry) {
    console.error('No paths found in spec');
    process.exit(1);
  }
  const [path, methods] = pathEntry;
  const methodEntry = Object.entries(methods)[0];
  if (!methodEntry) {
    console.error('No methods found for path');
    process.exit(1);
  }
  const [method, operation] = methodEntry;
  const nodeName = (operation.operationId || 'CustomNode').replace(/\s+/g, '');

  const outPath = await generateNode(spec, path, method, nodeName);
  console.log(`Node generated: ${outPath}`);
}

main();
