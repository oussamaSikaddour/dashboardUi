// Import utility to manage `inert` attribute for elements outside the opened container
import { toggleInertForAllExceptOpenedElement } from '../utils/Inert';
// Import utility to set appropriate ARIA accessibility attributes
import { dispatchCustomEvent } from '../utils/DespatchCustomEvent';

// Error State Management
const getErrorState = (errorsContainer) => {
  return errorsContainer.classList.contains("open");
};

const closeErrorContainer = (errorsContainer, closeButton) => {
  errorsContainer.classList.remove("open");
  toggleInertForAllExceptOpenedElement(errorsContainer, "open");
};

const openErrorContainer = (errorsContainer, closeButton) => {
  errorsContainer.classList.add("open");
  toggleInertForAllExceptOpenedElement(errorsContainer, "open");
  closeButton.focus();
};

// Event Handlers
const handleOpenErrorsClick = () => {
  dispatchCustomEvent("errors-notifications");
};

const handleCloseErrorsClick = (errorsContainer, closeButton) => {
  return () => closeErrorContainer(errorsContainer, closeButton);
};

const handleErrorsHappenedEvent = (errorsContainer, closeButton) => {
  return (e) => {
    e.preventDefault();
    openErrorContainer(errorsContainer, closeButton);
  };
};

// Element Selection
const getErrorElements = () => {
  const openButton = document.querySelector(".errors__opener");
  const errorsContainer = document.querySelector(".errors__container");
  const closeButton = errorsContainer?.querySelector(".errors__closer");
  
  return { openButton, errorsContainer, closeButton };
};

const validateErrorElements = (openButton, errorsContainer, closeButton) => {
  if (!openButton) {
    console.warn('Errors opener element not found');
    return false;
  }
  
  if (!errorsContainer) {
    console.warn('Errors container element not found');
    return false;
  }
  
  if (!closeButton) {
    console.warn('Errors closer element not found');
    return false;
  }
  
  return true;
};

// Event Listener Setup
const setupErrorEventListeners = (openButton, errorsContainer, closeButton) => {
  const openHandler = handleOpenErrorsClick;
  const closeHandler = handleCloseErrorsClick(errorsContainer, closeButton);
  const customEventHandler = handleErrorsHappenedEvent(errorsContainer, closeButton);
  
  openButton.addEventListener("click", openHandler);
  closeButton.addEventListener("click", closeHandler);
  document.addEventListener('errors-notifications', customEventHandler);
};

// Main Errors Component
const ErrorsNotifications = () => {
  const { openButton, errorsContainer, closeButton } = getErrorElements();
  
  if (!validateErrorElements(openButton, errorsContainer, closeButton)) {
    return;
  }
  
  setupErrorEventListeners(openButton, errorsContainer, closeButton);
};

export default ErrorsNotifications;