// Import a helper to control ARIA `inert` attributes for children
import { toggleInertForChildElement } from '../utils/Inert';

// Form Validation
const isValidFormElement = (form) => {
  return form && form.tagName && form.tagName.toLowerCase() === 'form';
};

// Input Focus Utilities
const isFocusableLabel = (element) => {
  return element?.matches('label[tabindex="0"]');
};

const isInputVisible = (input) => {
  return !input.matches('[style*="display: none"]') && !input.hasAttribute('hidden');
};

const focusElement = (element) => {
  element.focus();
};

const findFirstFocusableElement = (form) => {
  let currentElement = form.querySelector('input');
  
  while (currentElement) {
    if (isFocusableLabel(currentElement.nextElementSibling)) {
      return currentElement.nextElementSibling;
    } else if (isInputVisible(currentElement)) {
      return currentElement;
    } else {
      currentElement = currentElement.nextElementSibling;
    }
  }
  
  return null;
};

// Main Focus Function
export const focusNonHiddenInput = (form) => {
  if (!isValidFormElement(form)) {
    return;
  }

  const focusableElement = findFirstFocusableElement(form);
  
  if (focusableElement) {
    focusElement(focusableElement);
  }
};

// Error Clearing Utilities
const getDefaultForm = () => {
  return document.querySelector('.form');
};

const getFormInputs = (form) => {
  return form.querySelectorAll('input, select, textarea');
};

const getFormErrors = (form) => {
  return form.querySelectorAll('.input__error');
};

const clearErrorMessages = (errors) => {
  errors.forEach(error => {
    error.innerHTML = '';
  });
};

const createFocusHandler = (form) => {
  return () => {
    const errors = getFormErrors(form);
    clearErrorMessages(errors);
  };
};

// Main Error Clearing Function
export function clearErrorsOnFocus(myForm = null) {
  const form = myForm || getDefaultForm();
  
  if (!form) return;

  const inputs = getFormInputs(form);
  const focusHandler = createFocusHandler(form);

  inputs.forEach(input => {
    input.addEventListener('focus', focusHandler);
  });
}



// ======================
// STORAGE (SRP: Only handles storage)
// ======================
// ======================
// STORAGE (SRP: Only handles storage)
// ======================
const getStoredStep = (key) => {
  const stored = localStorage.getItem(key);
  return stored ? parseInt(stored) : null;
};

const storeStep = (key, step) => {
  localStorage.setItem(key, step);
};

export const clearStep = (key) => {
  localStorage.removeItem(key);
};

// ======================
// UPDATED ELEMENTS CODE
// ======================
const els = () => {
  const containers = document.querySelectorAll('.forMultiForm');
  return Array.from(containers).map(container => ({
    container: container,
    forms: container.querySelector('.forms'),
    buttons: container.querySelectorAll('[data-goto]')
  }));
};

const valid = (elements) => {
  return elements.filter(({ container, forms, buttons }) => 
    !!(container && forms && buttons.length)
  );
};

const syncInert = (forms, activeIndex) => {
  [...forms.children].forEach((form, idx) => {
    const active = idx + 1 === activeIndex;   // --form-position is 1-based
    toggleInertForChildElement(forms, form, 'slide', !active);
  });
};

// ======================
// ENHANCED goTo (uses container-specific key)
// ======================
const goTo = (container, forms, step, key) => {
  clearStep(key); // Clear before setting new step
  container.style.setProperty('--form-position', step);
  syncInert(forms, step);
  storeStep(key, step); // Store the step for persistence
};

// ======================
// STEP RESOLUTION (uses container-specific key)
// ======================
const resolveInitialStep = (requestedStep, key) => {
  const stored = getStoredStep(key);
  return stored || requestedStep || 1; // Priority: stored > requested > default
};

// ======================
// UPDATED HANDLER (uses container-specific key)
// ======================
const handler = (container, forms, key) => (e) => {
  const btn = e.target.closest('[data-goto]');
  if (!btn) return;
  e.preventDefault();
  goTo(container, forms, Number(btn.dataset.goto), key);
};

// ======================
// ENHANCED MAIN FUNCTION (uses array of keys)
// ======================
export const slide = ( keys = [],step) => {
  const allElements = els();
  const validElements = valid(allElements);
  
  if (!validElements.length) return;
  
  validElements.forEach(({ container, forms }, index) => {
    // Get the corresponding key from the array, or generate default if not provided
    const key = keys[index] || `slide-form-step-${index + 1}`;
    
    const initialStep = resolveInitialStep(step, key);
    goTo(container, forms, initialStep, key);
    forms.addEventListener('click', handler(container, forms, key));
  });
};