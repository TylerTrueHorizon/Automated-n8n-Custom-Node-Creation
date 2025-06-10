# Automated n8n Custom Node Creation

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

3. Compile and publish the node following [n8n's guide](https://docs.n8n.io/hosting/custom-nodes/create-community-nodes/). After publishing to npm, the package can be installed on any n8n instance.

## Example

```
node src/generate.js example-spec.json
```

This creates `generated/ExampleOperation.node.ts` which you can integrate into an n8n community package.

## License

MIT
