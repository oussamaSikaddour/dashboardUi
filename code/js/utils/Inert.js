
const toggleInert = (element, state = false) => {
  if (!element) return; // Safety check

  // Check if the browser supports native inert
  const supportsInert = 'inert' in HTMLElement.prototype;

  if (supportsInert) {
    state ? element.setAttribute('inert', '') : element.removeAttribute('inert');
  } else {
    // Fallback for browsers without inert support
    if (state) {
      element.setAttribute('aria-hidden', 'true'); // Hide from screen readers
      element.style.pointerEvents = 'none';        // Disable mouse interaction

      // Disable focus on all descendants
      element.querySelectorAll('a, button, input, textarea, select, [tabindex]').forEach((child) => {
        child.dataset.oldTabindex = child.getAttribute('tabindex'); // Save original tabindex
        child.setAttribute('tabindex', '-1');
      });
    } else {
      element.removeAttribute('aria-hidden');
      element.style.pointerEvents = '';

      // Restore original tabindex for descendants
      element.querySelectorAll('[data-old-tabindex]').forEach((child) => {
        const old = child.dataset.oldTabindex;
        if (old !== null) {
          child.setAttribute('tabindex', old);
        } else {
          child.removeAttribute('tabindex');
        }
        delete child.dataset.oldTabindex;
      });
    }
  }
};


/**
 * toggleInertWhenState
 * Conditionally toggles the `inert` attribute based on whether the element
 * has a given class name. You can invert this logic via `invertState`.
 *
 * Example: toggleInertWhenState(modal, 'open') → inert ON if modal is open.
 */

export const toggleInertWhenState = (element, className, invertState = false) => {
  if (!element) return;
  const isActive = element.classList.contains(className);
  toggleInert(element, invertState ? !isActive : isActive);
};
/**
 * toggleInertForChildElement
 * Applies the same logic as toggleInertWhenState but targets a *child* element.
 * Useful when you want a child to become inert based on the parent's state.
 */
export const toggleInertForChildElement = (parent, child, className, invertState = false) => {
  if (!parent || !child) return;
  const isActive = parent.classList.contains(className);
  toggleInert(child, invertState ? !isActive : isActive);
};

/**
 * toggleInertForAllExceptOpenedElement
 * Makes all direct children of <body> inert, *except* the specified element.
 * Often used in modals/dialogs to trap focus and prevent interaction outside.
 */


export const toggleInertForAllExceptOpenedElement = (openedElement, className, invertState = false) => {
  if (!openedElement) return;
 
  
  const isActive = openedElement.classList.contains(className);
  const bodyChildren = Array.from(document.body.children);

  bodyChildren.forEach((child) => {
    if (child !== openedElement) {
      toggleInert(child, invertState ? !isActive : isActive);
    }
  });
};