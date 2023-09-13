import { config } from 'dotenv';
import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ESLintPlugin from 'eslint-webpack-plugin';
import { paths } from "./paths.js";

export const plugins = [
  new HtmlWebpackPlugin({
    template: 'src/index.html'
  }),
  // Copy Cesium Assets, Widgets, and Workers to a static directory
  new CopyWebpackPlugin({
    patterns: [
      { from: path.join(paths.cesiumSource, paths.cesiumWorkers), to: 'Workers' },
      { from: path.join(paths.cesiumSource, 'Assets'), to: 'Assets' },
      { from: path.join(paths.cesiumSource, 'Widgets'), to: 'Widgets' }
    ]
  }),
  new webpack.DefinePlugin({
    // Define relative base path in cesium for loading assets
    CESIUM_BASE_URL: JSON.stringify('')
  }),
  new webpack.DefinePlugin({
    'process.env': JSON.stringify(config().parsed),
  }),
  new MiniCssExtractPlugin({
    filename: 'assets/css/[name].[contenthash].css',
  }),
  new ESLintPlugin({
        context: path.resolve(paths.root, './src'),
        emitError: true,
        emitWarning: true,
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
        failOnError: !process.env.NODE_ENV?.includes('dev'),
        failOnWarning: !process.env.NODE_ENV?.includes('dev'),
        lintDirtyModulesOnly: process.env.NODE_ENV?.includes('dev'),
        overrideConfigFile: path.resolve(paths.root, './.eslintrc'),
      }
  )
]
