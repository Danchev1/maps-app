import path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { merge } from 'webpack-merge';
import { paths } from './paths.js';
import common from './common.js';

const productionConfig = {
  plugins: [
    new CleanWebpackPlugin({
      root: path.resolve(paths.root, './dist')
    })
  ]
};

export const webpackProdConfig = merge(common, productionConfig);
