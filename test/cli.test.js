const { expect } = require('chai');
const fs = require('fs-extra');
const path = require('path');
const { execFile } = require('child_process');

const specPath = path.resolve(__dirname, '../example-spec.json');
const outputDir = path.join(__dirname, '../generated');

function run(command, args = []) {
  return new Promise((resolve, reject) => {
    execFile(command, args, { encoding: 'utf8' }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

describe('CLI generate.js', () => {
  afterEach(async () => {
    await fs.remove(outputDir);
  });

  it('generates node file', async () => {
    const { stdout } = await run('node', ['src/generate.js', specPath]);
    expect(stdout).to.match(/Node generated:/);
    expect(await fs.pathExists(path.join(outputDir, 'helloWorld.node.ts'))).to.be.true;
  });
});
