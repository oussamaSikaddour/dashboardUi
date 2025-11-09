// Import global styles
import '../scss/style.scss';
import { createLoader, showLoader, hideLoader } from './components/Loader.js';
import { initUIComponents } from './utils/initUIComponents.js';

// --- Boot on DOM Ready ---
document.addEventListener('DOMContentLoaded', async () => {

  createLoader();
  showLoader();

  // 3) Load UI modules
  await initUIComponents();

  // 4) UI ready → hide loader
  hideLoader();

});
