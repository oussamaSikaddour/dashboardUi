import { setAriaAttributes } from "../utils/Aria"; // Accessibility helper
import { dispatchCustomEvent } from "../utils/DespatchCustomEvent";

// Toast State Management
const getToastState = (toast) => {
  return toast.classList.contains("open");
};

const closeToast = (toast) => {
  toast.classList.remove("open");
  setAriaAttributes(true, "-1", toast);
};

const openToast = (toast) => {
  toast.classList.add("open");
  setAriaAttributes(false, "0", toast);
  toast.focus(); // Bring focus for accessibility
  setTimeout(() => {
    closeToast(toast); 
  }, 30000); 
};

// Event Handlers
const handleOpenToastClick = () => {
  dispatchCustomEvent("show-toast");
};

const handleToastClick = (toast) => {
  return () => closeToast(toast);
};

const handleToastKeyDown = (toast) => {
  return (e) => {
    if (e.key === "Enter" || e.key === " ") {
      closeToast(toast);
    }
  };
};

const handleShowToastEvent = (toast) => {
  return (e) => {
    e.preventDefault();
    openToast(toast);
  };
};

// Element Selection
const getToastElements = () => {
  const openButton = document.querySelector(".toast__opener");
  const closeButton = document.querySelector(".toast__closer");
  const toast = document.querySelector(".toast__container");
  
  return { openButton, closeButton, toast };
};

const validateToastElements = (openButton, closeButton, toast) => {
  if (!toast) {
    console.warn('Toast container element not found');
    return false;
  }
  
  if (!openButton) {
    console.warn('Toast opener element not found');
    return false;
  }
  
  if (!closeButton) {
    console.warn('Toast closer element not found');
    return false;
  }
  
  return true;
};

// Event Listener Setup
const setupToastEventListeners = (openButton, closeButton, toast) => {
  const openHandler = handleOpenToastClick;
  const clickHandler = handleToastClick(toast);
  const keyDownHandler = handleToastKeyDown(toast);
  const customEventHandler = handleShowToastEvent(toast);
  
  openButton.addEventListener("click", openHandler);
  closeButton.addEventListener("click", clickHandler);
  toast.addEventListener("click", clickHandler);
  toast.addEventListener("keydown", keyDownHandler);
  document.addEventListener('show-toast', customEventHandler);
};

// Main Toast Component
const Toast = () => {
  const { openButton, closeButton, toast } = getToastElements();
  
  if (!validateToastElements(openButton, closeButton, toast)) {
    return;
  }
  
  setupToastEventListeners(openButton, closeButton, toast);
};

export default Toast;