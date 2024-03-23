import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default defineConfig([
  {
    input: './src/index.ts',
    output: {
      dir: 'dist',
      format: 'cjs',
      entryFileNames: '[name].cjs.js',
      sourcemap: true,
    },
    plugins: [resolve({ exportConditions: ['node'] }), commonjs(), typescript(), json()],
  }, {
    input: './src/index.ts',
    output: {
      dir: 'dist',
      format: 'esm',
      entryFileNames: '[name].esm.js',
      sourcemap: true,
    },
    external: ['sharp'],
    plugins: [resolve({ exportConditions: ['node'] }), commonjs(), typescript(), json()],
  }
]);