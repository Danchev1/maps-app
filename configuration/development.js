import path from 'path';
import { merge } from 'webpack-merge';
import common from './common.js';
import { paths } from './paths.js';

const developmentConfig = {
  devServer: {
    client: {
      progress: true
    },
    compress: false,
    host: process.env.HOST_NAME || 'localhost',
    hot: true,
    open: true,
    port: process.env.PORT_NUMBER || 9000,
    static: [
      {
        directory: path.resolve(paths.root, './dist'),
        watch: true
      }
    ]
  },
  devtool: 'eval'
};

export const webpackDevConfig = merge(common, developmentConfig);
