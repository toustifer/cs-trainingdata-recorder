#!/usr/bin/node
import './load-dot-env-variables.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';
import { node } from './electron-vendors.mjs';

const rootFolderPath = fileURLToPath(new URL('..', import.meta.url));
const srcFolderPath = path.resolve(rootFolderPath, 'src');
const outFolderPath = path.resolve(rootFolderPath, 'out');

const commonDefine = {
  IS_PRODUCTION: 'true',
  IS_DEV: 'false',
};

// Plugin to mark all .node files as external
const externalNativeModulesPlugin = {
  name: 'external-native-modules',
  setup(build) {
    build.onResolve({ filter: /\.node$/ }, (args) => {
      return { path: args.path, external: true };
    });
  },
};

async function buildCliBundle() {
  await esbuild.build({
    entryPoints: [path.join(srcFolderPath, 'cli/cli.ts')],
    outfile: path.join(outFolderPath, 'cli.js'),
    bundle: true,
    sourcemap: false,
    minify: true,
    platform: 'node',
    target: `node${node}`,
    mainFields: ['module', 'main'],
    define: {
      ...commonDefine,
      'process.env.STEAM_API_KEYS': `"${process.env.STEAM_API_KEYS || ''}"`,
      'process.env.FACEIT_API_KEY': `"${process.env.FACEIT_API_KEY || ''}"`,
    },
    external: ['pg-native', '@aws-sdk/client-s3', 'registry-js'],
    alias: {
      fdir: './node_modules/fdir/dist/index.cjs',
    },
    plugins: [externalNativeModulesPlugin],
  });
}

try {
  console.log('Building CLI bundle...');
  await buildCliBundle();
  console.log('CLI bundle built successfully: out/cli.js');
} catch (error) {
  console.error(error);
  process.exit(1);
}
