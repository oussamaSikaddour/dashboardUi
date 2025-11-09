// Import utility to handle 'inert' state management
import { toggleInertForAllExceptOpenedElement } from "../utils/Inert";

// Import utility to set appropriate ARIA attributes for accessibility
import { setAriaAttributes } from "../utils/Aria";

// ======================
// DOM ELEMENT SELECTORS
// ======================
const getModalElements = () => ({
  openButton: document.querySelector(".modal__opener"),
  closeButton: document.querySelector(".modal__closer"),
  modal: document.querySelector(".modal"),
});

const hasValidModalElements = ({ modal, openButton, closeButton }) => {
  return !!(modal && openButton && closeButton);
};

// ======================
// MODAL STATE MANAGEMENT
// ======================
const getModalState = (modal) => {
  return modal.classList.contains("open");
};

const setModalState = (modal, isOpen) => {
  if (isOpen) {
    modal.classList.add("open");
    const modalCloser = modal.querySelector(".modal__closer");
    modalCloser.focus();
  } else {
    modal.classList.remove("open");
  }
};

// ======================
// ACCESSIBILITY MANAGEMENT
// ======================
const updateModalAccessibility = (modal, isOpen) => {
  const tabIndex = isOpen ? "0" : "-1";
  setAriaAttributes(!isOpen, tabIndex, modal);
};

const manageFocus = (closeButton, shouldFocus) => {
  if (shouldFocus) {
    closeButton.focus();
  }
};

// ======================
// INERT STATE MANAGEMENT
// ======================
const updateInertState = (modal, isOpen) => {
  toggleInertForAllExceptOpenedElement(modal, "open");
};

// ======================
// MODAL TOGGLE LOGIC
// ======================
const toggleModal = (modal, closeButton) => {
  const wasOpen = getModalState(modal);
  const willBeOpen = !wasOpen;

  // Update visual state
  setModalState(modal, willBeOpen);

  // Update accessibility
  updateModalAccessibility(modal, willBeOpen);

  // Update inert states
  updateInertState(modal, willBeOpen);

  // Manage focus
  manageFocus(closeButton, !willBeOpen);
};

// ======================
// EVENT HANDLERS
// ======================
const createOpenHandler = (modal, closeButton) => () => {
  toggleModal(modal, closeButton);
};

const createCloseHandler = (modal, closeButton) => () => {
  toggleModal(modal, closeButton);
};

// ======================
// EVENT BINDING
// ======================
const bindModalEvents = (openButton, closeButton, modal) => {
  const openHandler = createOpenHandler(modal, closeButton);
  const closeHandler = createCloseHandler(modal, closeButton);

  openButton.addEventListener("click", openHandler);
  closeButton.addEventListener("click", closeHandler);
};

// ======================
// MAIN INITIALIZER
// ======================
const Modal = () => {
  const elements = getModalElements();

  if (!hasValidModalElements(elements)) {
    console.warn("Modal: Required elements not found");
    return;
  }

  const { openButton, closeButton, modal } = elements;
  bindModalEvents(openButton, closeButton, modal);
};

export default Modal;
