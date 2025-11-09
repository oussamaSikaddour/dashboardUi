
import { handleKeyEvents } from "../utils/KeyEventHandlers";

import { toggleInertForChildElement } from "../utils/Inert";



/**
 * Toggles inert state on dropdown submenus (for accessibility on mobile).
 */
const toggleSubMenuPhoneInert = (dropDownMenu) => {
  if (!dropDownMenu) return;
  const submenu = dropDownMenu.querySelector(".nav__items--sub");
  if (!submenu) return;

  // Apply inverted inert: submenu is inert when parent is NOT clicked
  toggleInertForChildElement(dropDownMenu, submenu, "clicked", true);
};

/**
 * Updates ARIA attributes and visibility of a submenu based on button state.
 */
const updateNavSubMenuState = (navButton) => {
  if (!navButton) return;
  const submenu = navButton.nextElementSibling;
  if (!submenu) return;
  const isExpanded = navButton.classList.contains("clicked");
  // Nav button ARIA updates
  navButton.setAttribute("aria-expanded", isExpanded);
  navButton.setAttribute("aria-hidden", !isExpanded);
  navButton.toggleAttribute("hidden", !isExpanded);
  // Submenu inert state
  toggleSubMenuPhoneInert(navButton.parentElement);
};

/**
 * Controls which nav button and submenu are active, hides others.
 */


const toggleNavButton = (index, navButtons) => {
  const clickedButton = navButtons[index];
  if (!clickedButton) return;

  navButtons.forEach((btn, i) => {
    const parent = btn.parentElement;
    if (!parent) return;

    if (i === index) {
      btn.classList.toggle("clicked");
      parent.classList.toggle("clicked");
    } else {
      btn.classList.remove("clicked");
      parent.classList.remove("clicked");
    }

    updateNavSubMenuState(btn);
  });
};

/**
 * Quits/Closes menu and focuses the button that triggered it.
 */


const closeMenuAndFocus = (index, navButtons) => {
  toggleNavButton(index, navButtons);
  navButtons[index]?.focus();
};

/**
 * Handles keyboard navigation inside a submenu.
 */
const handleSubMenuKeyboard = (index, navButtons) => {
  const navButton = navButtons[index];
  if (!navButton) return;

  const submenu = navButton.nextElementSibling;
  if (!submenu) return;

  const menuItems = Array.from(submenu.querySelectorAll("[role='menuitem']"));
  menuItems[0]?.focus();

  submenu.addEventListener("keydown", (event) => {
    const pressedItem = event.target.closest("[role='menuitem']");
    const i = menuItems.indexOf(pressedItem);

    handleKeyEvents(event, i, null, menuItems, () => closeMenuAndFocus(index, navButtons));
  });
};

/**
 * Attaches click and keydown handlers for all nav buttons.
 */

const setupNavButtonHandlers = (navButtons) => {
  navButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => toggleNavButton(index, navButtons));

    btn.addEventListener("keydown", (event) => {
      if (event.code === "Enter" || event.code === "Space") {
        toggleNavButton(index, navButtons);
      }

      if (btn.classList.contains("clicked")) {
        handleSubMenuKeyboard(index, navButtons);
      }
    });
  });
};
/**
 * Applies inert handling to each mobile dropdown menu initially.
 */
const initInertForMobileMenus = (dropDownMenus) => {
  dropDownMenus?.forEach((menu) => toggleSubMenuPhoneInert(menu));
};
/**
 * Toggles mobile nav menu visibility and updates ARIA attributes.
 */

const toggleMobileMenu = (hamburgerBtn, navPhone) => {
  if (!hamburgerBtn || !navPhone) return;

  const isOpen = hamburgerBtn.classList.toggle("open");
  navPhone.classList.toggle("open");

  hamburgerBtn.setAttribute("aria-expanded", isOpen);
  hamburgerBtn.setAttribute("aria-hidden", !isOpen);
  navPhone.toggleAttribute("hidden", !isOpen);
};



const Navigation = () => {
  const navButtons = Array.from(document.querySelectorAll(".nav__btn--dropdown"));
  const hamburgerBtn = document.querySelector(".nav__humb");
  const navPhone = document.querySelector(".nav--phone");
  const dropDownMenus = document.querySelectorAll(".nav--phone .nav__item--dropDown");

  // Mobile menu toggle
  hamburgerBtn?.addEventListener("click", () => toggleMobileMenu(hamburgerBtn, navPhone));

  setupNavButtonHandlers(navButtons);
  initInertForMobileMenus(dropDownMenus);
};

export default Navigation;