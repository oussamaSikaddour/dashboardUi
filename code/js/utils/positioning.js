/**
 * Element Position & Dimensions Utility (SRP Compliant)
 * -----------------------------------------------------
 * Utilities for safely retrieving, calculating, and setting
 * element position, visibility, and dimensions.
 * Each function respects the Single Responsibility Principle (SRP).
 */

// ==================== CORE FUNCTIONS ====================

/**
 * Safely get a DOM element (SRP: Element Retrieval)
 * @param {string|Element} element - CSS selector or DOM element
 * @returns {Element|null} - DOM element or null
 */
function getElement(element) {
  if (!element) {
    console.warn('getElement: No element provided');
    return null;
  }

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    console.warn('getElement: DOM not available');
    return null;
  }

  try {
    return typeof element === 'string'
      ? document.querySelector(element)
      : element instanceof Element
        ? element
        : null;
  } catch (error) {
    console.error('getElement: Invalid element', error);
    return null;
  }
}

/**
 * Collect geometry and viewport data (SRP: Layout Data Collection)
 * @param {Element} targetEl - The reference element
 * @param {Element} floatingEl - The element to position
 * @returns {Object} - Layout data (rects, viewport, scroll)
 */
function getLayoutData(targetEl, floatingEl) {
  const targetRect = targetEl.getBoundingClientRect();
  const floatRect = floatingEl.getBoundingClientRect();
  const { innerWidth: vw, innerHeight: vh } = window;
  const { scrollX, scrollY } = window;

  return {
    targetRect,
    floatRect,
    viewport: { width: vw, height: vh },
    scroll: { x: scrollX, y: scrollY }
  };
}

/**
 * Check available space for positioning (SRP: Space Availability Calculation)
 * @param {DOMRect} targetRect
 * @param {DOMRect} floatRect
 * @param {Object} viewport
 * @param {number} offset
 * @returns {Object} - Boolean flags for top/bottom/left/right
 */
function calculateFitAvailability(targetRect, floatRect, viewport, offset) {
  return {
    top: targetRect.top >= floatRect.height + offset,
    bottom: targetRect.bottom + floatRect.height + offset <= viewport.height,
    right: targetRect.right + floatRect.width + offset <= viewport.width,
    left: targetRect.left - floatRect.width - offset >= 0
  };
}

/**
 * Compute the optimal position for the floating element (SRP: Position Strategy)
 * @param {DOMRect} targetRect
 * @param {DOMRect} floatRect
 * @param {Object} viewport
 * @param {number} offset
 * @returns {Object} - { top, left, name } position object
 */
function calculatePosition(targetRect, floatRect, viewport, offset) {
  const fits = calculateFitAvailability(targetRect, floatRect, viewport, offset);
  
  // Default position: top
  let position = { 
    top: targetRect.top - floatRect.height - offset,
    left: targetRect.left + (targetRect.width - floatRect.width) / 2,
    name: "top"
  };

  // Adjust vertical position if top doesn't fit
  if (!fits.top && fits.bottom) {
    position.top = targetRect.bottom + offset;
    position.name = "bottom";
  }

  // Adjust horizontal position if out of bounds
  if (position.left < 0) {
    position.left = offset;
    position.name += "-left";
  } else if (position.left + floatRect.width > viewport.width) {
    position.left = viewport.width - floatRect.width - offset;
    position.name += "-right";
  }

  // Fallback to side placements if neither top nor bottom fit
  if (!fits.top && !fits.bottom) {
    if (fits.right) {
      position.left = targetRect.right + offset;
      position.top = targetRect.top + (targetRect.height - floatRect.height) / 2;
      position.name = "right";
    } else if (fits.left) {
      position.left = targetRect.left - floatRect.width - offset;
      position.top = targetRect.top + (targetRect.height - floatRect.height) / 2;
      position.name = "left";
    }
  }

  return position;
}

/**
 * Apply calculated position to the floating element (SRP: DOM Manipulation)
 * @param {Element} floatingEl - The element to position
 * @param {Object} position - { top, left, name }
 * @param {Object} scroll - { x, y }
 */
function applyPosition(floatingEl, position, scroll) {
  if (!floatingEl || !position) return;

  floatingEl.style.position = "absolute";
  floatingEl.style.top = `${position.top + scroll.y}px`;
  floatingEl.style.left = `${position.left + scroll.x}px`;
  floatingEl.dataset.position = position.name;
}

// ==================== MAIN EXPORT ====================

/**
 * Position one element relative to another.
 * Automatically adjusts to fit within the viewport.
 *
 * @param {string|Element} targetEl - The reference element or selector.
 * @param {string|Element} floatingEl - The floating element or selector.
 * @param {number} [offset=8] - Space (in px) between the elements.
 */
export function positionRelativeTo(targetEl, floatingEl, offset = 8) {
  const targetElement = getElement(targetEl);
  const floatingElement = getElement(floatingEl);
  
  if (!targetElement || !floatingElement) {
    console.warn('positionRelativeTo: Invalid target or floating element');
    return;
  }

  const layoutData = getLayoutData(targetElement, floatingElement);
  const position = calculatePosition(
    layoutData.targetRect, 
    layoutData.floatRect, 
    layoutData.viewport, 
    offset
  );
  
  applyPosition(floatingElement, position, layoutData.scroll);
}

// ==================== OPTIONAL EXPORTS ====================
// (Useful for testing or external use)

export {
  getElement,
  getLayoutData,
  calculateFitAvailability,
  calculatePosition,
  applyPosition
};
