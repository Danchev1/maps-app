import path from 'path';
import { paths } from './paths.js';

export default {
  alias: {
    cesium: path.resolve(paths.root, paths.cesiumSource)
  },
  fallback: {
    fs: false,
    tls: false,
    url: false,
    net: false,
    path: false,
    zlib: false,
    http: false,
    https: false,
    stream: false,
    crypto: false
  },
  mainFiles: ['module', 'main', 'Cesium'],
  extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
};
