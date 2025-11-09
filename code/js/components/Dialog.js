// Import utility to control "inert" state for accessibility
import { toggleInertForAllExceptOpenedElement } from '../utils/Inert';
// Import helper to manage ARIA attributes for accessibility
import { setAriaAttributes } from '../utils/Aria';

// Dialog State Management
const getDialogState = (dialogElement) => {
  return dialogElement.classList.contains("open");
};

const openDialog = (dialogElement, closeButton) => {
  dialogElement.classList.add("open");
  setAriaAttributes(false, "0", dialogElement);
  toggleInertForAllExceptOpenedElement(dialogElement, "open");
  dialogElement.focus();
};

const closeDialog = (dialogElement, closeButton) => {
  dialogElement.classList.remove("open");
  setAriaAttributes(true, "-1", dialogElement);
  toggleInertForAllExceptOpenedElement(dialogElement, "open");
  closeButton.focus();
};

// Dialog Toggle Logic
const toggleDialog = (dialogElement, closeButton) => {
  const isOpen = getDialogState(dialogElement);

  if (isOpen) {
    closeDialog(dialogElement, closeButton);
  } else {
    openDialog(dialogElement, closeButton);
  }
};

// Event Handlers
const createOpenHandler = (dialogElement, closeButton) => {
  return () => toggleDialog(dialogElement, closeButton);
};

const createCloseHandler = (dialogElement, closeButton) => {
  return () => toggleDialog(dialogElement, closeButton);
};

// Element Selection
const getDialogElements = () => {
  const openButton = document.querySelector(".dialog__opener");
  const closeButton = document.querySelector(".dialog__closer");
  const dialogElement = document.querySelector(".dialog");
  
  return { openButton, closeButton, dialogElement };
};

const validateDialogElements = (openButton, closeButton, dialogElement) => {
  if (!dialogElement) {
    console.warn('Dialog element not found');
    return false;
  }
  
  if (!openButton) {
    console.warn('Dialog opener element not found');
    return false;
  }
  
  if (!closeButton) {
    console.warn('Dialog closer element not found');
    return false;
  }
  
  return true;
};

// Event Listener Setup
const setupDialogEventListeners = (openButton, closeButton, dialogElement) => {
  const openHandler = createOpenHandler(dialogElement, closeButton);
  const closeHandler = createCloseHandler(dialogElement, closeButton);
  
  openButton.addEventListener("click", openHandler);
  closeButton.addEventListener("click", closeHandler);
};

// Main Dialog Component
const Dialog = () => {
  const { openButton, closeButton, dialogElement } = getDialogElements();
  
  if (!validateDialogElements(openButton, closeButton, dialogElement)) {
    return;
  }
  
  setupDialogEventListeners(openButton, closeButton, dialogElement);
};

export default Dialog;