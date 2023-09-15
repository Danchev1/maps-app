import { initViewer } from './services/Viewer';
import './assets/css/main.scss';

initViewer()
  .then(() => console.log('Viewer Init'))
  .catch((err) => console.log('Viewer error', err));
