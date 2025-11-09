// Import helper to focus the first non-hidden input in a form
import { focusNonHiddenInput } from './Form.js';

let loaderContainer = null;

export function createLoader() {
  if (loaderContainer) return; // Prevent creating duplicates

  loaderContainer = document.createElement('div');
  loaderContainer.className = 'loader__container';

  const loader = document.createElement('div');
  loader.className = 'loader l';

  loader.innerHTML = `
    <div class="loader__circle"></div>
    <div class="loader__circle"></div>
  `;

  loaderContainer.appendChild(loader);
  document.body.appendChild(loaderContainer);
}

export function showLoader() {
  if (!loaderContainer) createLoader();
  loaderContainer.classList.add('show');
}

export function hideLoader() {
  if (!loaderContainer) return;
  loaderContainer.classList.remove('show');

  // after loader hides, focus first usable form input
  const form = document.querySelector('.form');
  if (form) focusNonHiddenInput(form);
}
