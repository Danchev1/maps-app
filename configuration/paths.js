import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const paths = {
  root: path.resolve(__dirname, '../'),
  cesiumSource: 'node_modules/cesium/Source',
  cesiumWorkers: '../Build/Cesium/Workers'
};
