const { expect } = require('chai');
const fs = require('fs-extra');
const path = require('path');
const { generateNode } = require('../src/generator');

const spec = require('../example-spec.json');

const outputDir = path.join(__dirname, 'generated');

describe('generateNode', () => {
  afterEach(async () => {
    await fs.remove(outputDir);
  });

  it('creates a node file from spec', async () => {
    const file = await generateNode(spec, '/hello', 'get', 'HelloWorld', outputDir);
    expect(await fs.pathExists(file)).to.be.true;
    const content = await fs.readFile(file, 'utf8');
    expect(content).to.include('class HelloWorld');
    expect(content).to.include("method: 'GET'");
  });

  it('throws when path missing', async () => {
    let err;
    try {
      await generateNode(spec, '/missing', 'get', 'Missing', outputDir);
    } catch (e) {
      err = e;
    }
    expect(err).to.be.instanceOf(Error);
  });
});
