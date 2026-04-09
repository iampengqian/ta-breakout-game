import { build } from 'esbuild'

export default {
  entryPoints: ['src/index.js'],
  bundle: true,
  outfile: 'dist/bundle.js',
  format: 'esm',
  sourcemap: true,
  minify: false,
  target: ['es2020'],
}