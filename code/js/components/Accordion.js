import { handleKeyEvents } from "../utils/KeyEventHandlers";

// DOM State Management
const getAccordionState = (header) => {
  return header.classList.contains('active');
};

const setAccordionHeaderState = (header, isActive) => {
  header.classList.toggle('active', isActive);
  header.setAttribute('aria-expanded', isActive);
};

const setAccordionPanelState = (panel, isActive) => {
  panel.classList.toggle('open', isActive);
  panel.setAttribute('aria-hidden', !isActive);
};

const updateAccordionItemState = (header, panel, isActive) => {
  setAccordionHeaderState(header, isActive);
  setAccordionPanelState(panel, isActive);
};

// Accordion Mode Detection
const isAccordionOpenAllMode = (accordion) => {
  return accordion.classList.contains('all-tabs-can-open');
};

// Accordion Toggle Logic
const closeAllAccordionItems = (accordionHeaders, accordionPanels) => {
  accordionHeaders.forEach((header, index) => {
    updateAccordionItemState(header, accordionPanels[index], false);
  });
};

const openAccordionItem = (index, accordionHeaders, accordionPanels) => {
  updateAccordionItemState(accordionHeaders[index], accordionPanels[index], true);
};

const closeAccordionItem = (index, accordionHeaders, accordionPanels) => {
  updateAccordionItemState(accordionHeaders[index], accordionPanels[index], false);
};

const toggleSingleAccordionItem = (index, accordionHeaders, accordionPanels) => {
  const isCurrentlyActive = getAccordionState(accordionHeaders[index]);
  
  closeAllAccordionItems(accordionHeaders, accordionPanels);
  
  if (!isCurrentlyActive) {
    openAccordionItem(index, accordionHeaders, accordionPanels);
  }
};

const toggleMultiAccordionItem = (index, accordionHeaders, accordionPanels) => {
  const isCurrentlyActive = getAccordionState(accordionHeaders[index]);
  
  if (isCurrentlyActive) {
    closeAccordionItem(index, accordionHeaders, accordionPanels);
  } else {
    openAccordionItem(index, accordionHeaders, accordionPanels);
  }
};

const toggleAccordion = (index, accordionHeaders, accordionPanels, accordion) => {
  const isMultiOpen = isAccordionOpenAllMode(accordion);
  
  if (isMultiOpen) {
    toggleMultiAccordionItem(index, accordionHeaders, accordionPanels);
  } else {
    toggleSingleAccordionItem(index, accordionHeaders, accordionPanels);
  }
};

// Event Handling
const getClickedHeaderIndex = (event, accordionHeaders) => {
  const header = event.target.closest('.accordion__header');
  if (!header) return -1;
  return accordionHeaders.indexOf(header);
};

const handleAccordionClick = (event, accordionHeaders, accordionPanels, accordion) => {
  const index = getClickedHeaderIndex(event, accordionHeaders);
  if (index === -1) return;
  
  toggleAccordion(index, accordionHeaders, accordionPanels, accordion);
};

const handleAccordionKeyDown = (event, accordionHeaders, accordionPanels, accordion) => {
  const index = getClickedHeaderIndex(event, accordionHeaders);
  if (index === -1) return;
  
  const toggleCallback = () => toggleAccordion(index, accordionHeaders, accordionPanels, accordion);
  handleKeyEvents(event, index, toggleCallback, accordionHeaders);
};

const manageAccordionEvent = (event, accordionHeaders, accordionPanels, accordion) => {
  if (event.type === "click") {
    handleAccordionClick(event, accordionHeaders, accordionPanels, accordion);
  } else if (event.type === "keydown") {
    handleAccordionKeyDown(event, accordionHeaders, accordionPanels, accordion);
  }
};

// Initialization
const initializeAccordionEventListeners = (accordion, accordionHeaders, accordionPanels) => {
  const eventHandler = (event) => {
    manageAccordionEvent(event, accordionHeaders, accordionPanels, accordion);
  };
  
  accordion.addEventListener('click', eventHandler);
  accordion.addEventListener('keydown', eventHandler);
};

const initializeFirstAccordion = (accordionHeaders, accordionPanels) => {
  if (accordionHeaders.length > 0) {
    openAccordionItem(0, accordionHeaders, accordionPanels);
  }
};

const validateAccordionStructure = (accordionHeaders, accordionPanels, accordion) => {
  if (accordionHeaders.length === 0) {
    console.warn('Accordion has no headers', accordion);
    return false;
  }
  
  if (accordionHeaders.length !== accordionPanels.length) {
    console.warn('Accordion has mismatched headers and panels', accordion);
    return false;
  }
  
  return true;
};

// Main Accordion Component
const Accordion = () => {
  const accordions = document.querySelectorAll('.accordion');
  
  accordions.forEach((accordion) => {
    const accordionHeaders = Array.from(accordion.querySelectorAll('.accordion__header'));
    const accordionPanels = Array.from(accordion.querySelectorAll('.accordion__panel'));
    
    if (!validateAccordionStructure(accordionHeaders, accordionPanels, accordion)) {
      return;
    }
    
    initializeAccordionEventListeners(accordion, accordionHeaders, accordionPanels);
    
    // Only auto-open first item if not in multi-open mode
    if (!isAccordionOpenAllMode(accordion)) {
      initializeFirstAccordion(accordionHeaders, accordionPanels);
    }
  });
};

export default Accordion;