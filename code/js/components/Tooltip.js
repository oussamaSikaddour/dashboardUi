/**
 * Tooltip Utility (Simplified + Dynamic Content)
 * ----------------------------------------------
 * Handles tooltip show/hide and dynamic content loading
 * from `.tooltip__content` inside each `.hasToolTip` element.
 */

import { positionRelativeTo } from "../utils/positioning";

/**
 * Get tooltip content from element
 * @param {Element} el
 * @returns {string}
 */
const getTooltipContent = (el) => {
  const contentEl = el.querySelector(".tooltip__content");
  return contentEl ? contentEl.innerHTML.trim() : "";
};

/**
 * Set tooltip content into global tooltip
 * @param {Element} tooltip
 * @param {string} content
 */
const setTooltipContent = (tooltip, content) => {
  tooltip.innerHTML = content;
};

const ToolTip = () => {
  const tooltip = document.querySelector(".tooltip");
  if (!tooltip) {
    console.warn("ToolTip: No tooltip element found");
    return;
  }

  const elements = document.querySelectorAll(".hasTooltip");

  elements.forEach((el) => {
    const show = () => {
      const content = getTooltipContent(el);
      if (!content) return;

      setTooltipContent(tooltip, content);
      positionRelativeTo(el, tooltip, 4);
      tooltip.classList.add("show");
    };

    const hide = () => {
      tooltip.classList.remove("show");
      setTooltipContent(tooltip, ""); // clear after hide
    };

    // Hover events
    el.addEventListener("mouseenter", show);
    el.addEventListener("mouseleave", hide);

    // Touch (mobile)
    el.addEventListener("touchstart", (e) => {
      e.stopPropagation();
      show();
      setTimeout(hide, 1500);
    });
  });
};

export default ToolTip;
