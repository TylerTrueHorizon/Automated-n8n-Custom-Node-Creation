const { expect } = require('chai');
const fs = require('fs-extra');
const path = require('path');
const fetch = require('node-fetch');
const { spawn } = require('child_process');

const spec = require('../example-spec.json');
const outputDir = path.join(__dirname, '../generated');
let server;

function waitForServer(port, timeout = 5000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    (function check() {
      fetch(`http://localhost:${port}/`).then(() => resolve()).catch(() => {
        if (Date.now() - start > timeout) reject(new Error('server not started'));
        else setTimeout(check, 100);
      });
    })();
  });
}

describe('server /generate', () => {
  before(async () => {
    server = spawn('node', ['src/server.js']);
    await waitForServer(3000);
  });

  after(() => {
    server.kill();
  });

  afterEach(async () => {
    await fs.remove(outputDir);
  });

  it('returns generated code', async () => {
    const res = await fetch('http://localhost:3000/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        spec,
        nodeName: 'HelloWorld',
        apiPath: '/hello',
        method: 'get'
      })
    });
    const json = await res.json();
    expect(json.code).to.include('class HelloWorld');
    expect(await fs.pathExists(path.join(outputDir, 'HelloWorld.node.ts'))).to.be.true;
  });
});
