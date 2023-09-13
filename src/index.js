import { initViewer } from './services/Viewer.js';
import './assets/css/main.scss';

initViewer()
  .then(() => console.log('Viewer Init'))
  .catch((err) => console.log('Viewer error', err));
