const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

async function main() {
  const nodeFile = process.argv[2];
  if (!nodeFile) {
    console.error('Usage: node src/publish.js <generated-node-file> [--install <n8n-dir>]');
    process.exit(1);
  }

  const installIndex = process.argv.indexOf('--install');
  const installDir = installIndex !== -1 ? process.argv[installIndex + 1] : null;

  const fullPath = path.resolve(nodeFile);
  const pkgDir = path.dirname(fullPath);
  const nodeName = path.basename(fullPath, '.node.ts');
  const pkgName = `n8n-nodes-${nodeName.toLowerCase()}`;

  // package.json
  const pkgJson = {
    name: pkgName,
    version: '0.1.0',
    description: 'Auto-generated n8n node',
    main: 'dist/index.js',
    keywords: ['n8n-community-node-package'],
    scripts: {
      build: 'tsc',
      prepublishOnly: 'npm run build'
    },
    n8n: {
      nodes: [`dist/${nodeName}.node.js`]
    },
    devDependencies: {
      typescript: '^5.0.0'
    },
    peerDependencies: {
      'n8n-workflow': '*'
    }
  };
  await fs.writeJson(path.join(pkgDir, 'package.json'), pkgJson, { spaces: 2 });

  // index.ts
  await fs.writeFile(path.join(pkgDir, 'index.ts'), `export * from './${nodeName}.node';\n`);

  // tsconfig.json
  const tsconfig = {
    compilerOptions: {
      target: 'ES2019',
      module: 'CommonJS',
      declaration: true,
      outDir: 'dist',
      rootDir: '.',
      esModuleInterop: true,
      strict: false
    },
    include: [
      `${nodeName}.node.ts`,
      'index.ts'
    ]
  };
  await fs.writeJson(path.join(pkgDir, 'tsconfig.json'), tsconfig, { spaces: 2 });

  // compile
  execSync('npx tsc', { cwd: pkgDir, stdio: 'inherit' });

  // publish to npm
  execSync('npm publish --access public', { cwd: pkgDir, stdio: 'inherit' });

  // optional install
  if (installDir) {
    execSync(`npm install ${pkgDir}`, { cwd: path.resolve(installDir), stdio: 'inherit' });
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
