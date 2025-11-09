// Utility function to update ARIA-related attributes for accessibility
export const setAriaAttributes = (hidden, tabindex, element) => {
  // `aria-hidden` determines if the element should be ignored by assistive technologies
  element.setAttribute("aria-hidden", hidden);
  // `tabindex` controls whether the element is focusable and its tab order
  element.setAttribute("tabindex", tabindex);
};
