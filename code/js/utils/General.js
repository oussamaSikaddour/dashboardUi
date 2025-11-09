// Debounce utility to limit how often a function can be executed
// Useful for performance optimization (e.g., input or scroll events)
export const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout); // Clear any previously set timer
    timeout = setTimeout(() => func?.apply(this, args), wait); // Delay function execution
  };
};

// Retrieve the computed background color of a DOM element
export const getBackgroundColor = (element) => {
  const computedStyle = window.getComputedStyle(element); // Gets all computed styles
  return computedStyle.backgroundColor; // Returns just the background color
};

