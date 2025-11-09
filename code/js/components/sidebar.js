// Import key event handler utility and inert state toggler
import { handleKeyEvents } from '../utils/KeyEventHandlers';
import { toggleInertWhenState } from '../utils/Inert';

const updateMenuButtonState = (btn) => {
  const isExpanded = btn.classList.contains("clicked");
  btn.setAttribute("aria-expanded", isExpanded);
  btn.setAttribute("aria-hidden", !isExpanded);
  //  btn.classList.toggle("clicked"); 
};


const resetOtherButtons = (sidebarButtons, activeBtn) => {
  sidebarButtons.forEach((btn) => {
    if (btn !== activeBtn) {
      btn.classList.remove("clicked");
    }
    updateMenuButtonState(btn);
  });
};
// Handle toggling the visibility of the menu and inert states


const toggleMenuVisibility = (btn, sidebarButtons, sidebar) => {
  if (!btn || !sidebar) return;

  resetOtherButtons(sidebarButtons, btn);

  sidebar.classList.toggle("open"); // Open/close the main sidebar
  btn.classList.toggle("clicked");  // Toggle clicked state
  updateMenuButtonState(btn);

  // Make background inert when menu is open
  toggleInertWhenState(sidebar, "open", true);
};

// Close the main menu and refocus on the corresponding button
const quiteMainMenu = (index, mainMenuButtons, menu) => {
  toggleMenuVisibility(mainMenuButtons[index], mainMenuButtons, menu);
  mainMenuButtons[index].focus(); // Refocus on the button that triggered the close
};

const closeSidebar = (index, sidebarButtons, sidebar) => {
  toggleMenuVisibility(sidebarButtons[index], sidebarButtons, sidebar);
  sidebarButtons[index]?.focus();
};

// Manage keyboard navigation inside the menu

const handleSidebarKeyboardNavigation = (index, sidebarButtons, sidebar) => {
  if (!sidebar) return;

  const menuItems = Array.from(sidebar.querySelectorAll("[role='menuitem']"));
  menuItems[0]?.focus();

  const onKeyDown = (event) => {
    const pressedItem = event.target.closest("[role='menuitem']");
    const i = menuItems.indexOf(pressedItem);

    handleKeyEvents(
      event,
      i,
      null,
      menuItems,
      () => closeSidebar(index, sidebarButtons, sidebar)
    );
  };

  sidebar.addEventListener("keydown", onKeyDown, { once: true });
};



/**
 * Queries and returns sidebar buttons and container.
 */
const getSidebarElements = () => {
  const buttons = Array.from(document.querySelectorAll(".sidebar__btn"));
  const sidebar = document.querySelector(".sidebar");
  return { buttons, sidebar };
};

/**
 * Attaches click handler to toggle the sidebar menu.
 */
const attachClickHandler = (btn, buttons, sidebar) => {
  btn.addEventListener("click", () => toggleMenuVisibility(btn, buttons, sidebar));
};

/**
 * Attaches keyboard handler (Space / Enter) to toggle sidebar menu.
 */
const attachKeyboardHandler = (btn, index, buttons, sidebar) => {
  btn.addEventListener("keydown", (event) => {
    if (event.code === "Space" || event.code === "Enter") {
      event.preventDefault();
      toggleMenuVisibility(btn, buttons, sidebar);

      if (btn.classList.contains("clicked")) {
        handleSidebarKeyboardNavigation(index, buttons, sidebar);
      }
    }
  });
};

/**
 * Initializes all sidebar buttons with click and keyboard handlers.
 */
const initSidebarButtons = (buttons, sidebar) => {
  buttons.forEach((btn, index) => {
    attachClickHandler(btn, buttons, sidebar);
    attachKeyboardHandler(btn, index, buttons, sidebar);
  });
};

/**
 * Initializes the sidebar menu.
 */
const Sidebar = () => {
  const { buttons, sidebar } = getSidebarElements();
  if (!sidebar) return;

  // Initialize inert state (menu is inert when closed)
  toggleInertWhenState(sidebar, "open", true);

  // Set up buttons
  initSidebarButtons(buttons, sidebar);
};



export default Sidebar;
