# Automated n8n Custom Node Creation

This project provides tools to generate a minimal n8n community node from an OpenAPI specification. A CLI tool and a small web UI are included to help create and preview nodes.

## CLI Usage
This project provides a simple CLI tool that generates a minimal n8n community node from an OpenAPI specification. The goal is to automate boilerplate creation so you can quickly publish or install custom nodes.

## Usage

1. Install dependencies:

```bash
npm install
```

2. Run the generator with an OpenAPI JSON file:

```bash
node src/generate.js path/to/openapi.json
```

The script reads the first path and method from the specification and produces a TypeScript node under the `generated/` folder.

## Web UI

A basic Express server serves a single-page interface to test node generation interactively.

```bash
npm start
```

Then open `http://localhost:3000` in your browser. Paste an OpenAPI spec, choose a path and method, provide a node name and click **Generate** to preview the generated code.

## Publishing

To publish a generated node to npm you can use the helper script:

```bash
node src/publish.js generated/ExampleOperation.node.ts
```

This command compiles the TypeScript file, runs `npm publish` in the
`generated` folder and makes the package available in the npm registry.
Passing `--install /path/to/.n8n` will also install the package into an
existing n8n instance.

## Example

```bash
3. Compile and publish the node following [n8n's guide](https://docs.n8n.io/hosting/custom-nodes/create-community-nodes/). After publishing to npm, the package can be installed on any n8n instance.

## Example

```
node src/generate.js example-spec.json
```

This creates `generated/ExampleOperation.node.ts` which you can integrate into an n8n community package.

## License

MIT
