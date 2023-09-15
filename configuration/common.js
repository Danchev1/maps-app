import path from 'path';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { paths } from './paths.js';
import resolve from './resolve.js';
import module from './module.js';
import { plugins } from './plugins.js';

export default {
  context: paths.root,
  entry: {
    app: './src/index.ts'
  },
  output: {
    filename: 'app.js',
    path: path.resolve(paths.root, './dist'),
    sourcePrefix: ''
  },
  mode: process.env.NODE_ENV?.includes('dev') ? 'development' : 'production',
  amd: {
    // Enable webpack-friendly use of require in Cesium
    toUrlUndefined: true
  },
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()]
  },
  resolve,
  module,
  plugins
};
