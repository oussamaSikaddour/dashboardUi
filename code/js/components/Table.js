import { toggleInertWhenState } from "../utils/Inert";

// ----------------------------
// Utility helpers
// ----------------------------
const updateAriaAttributes = (element, expanded, hidden) => {
  element?.setAttribute("aria-expanded", expanded);
  element?.setAttribute("aria-hidden", hidden);
};

const focusFirstInteractive = (container) => {
  const firstFocusable = container?.querySelector("input, select, textarea, button");
  if (firstFocusable) firstFocusable.focus();
};

const toggleElementVisibility = (element, isVisible) => {
  if (!element) return;
  element.classList.toggle("open", isVisible);
  toggleInertWhenState(element, "open", true);
};

const openPanel = (btn, panel) => {
  toggleElementVisibility(panel, true);
  updateAriaAttributes(btn, true, false);
  focusFirstInteractive(panel);
};

const closePanel = (btn, panel) => {
  toggleElementVisibility(panel, false);
  updateAriaAttributes(btn, false, true);
};

const closeAllPanels = (tc) => {
  const filterBtn = tc.querySelector(".table__filters__btn");
  const filters = tc.querySelector(".table__filters");
  const formBtn = tc.querySelector(".table__form__opener");
  const form = tc.querySelector(".table__form");

  closePanel(filterBtn, filters);
  closePanel(formBtn, form);
};

// ----------------------------
// Table container logic
// ----------------------------
const setupTableContainer = (tc) => {
  const filterBtn = tc.querySelector(".table__filters__btn");
  const filtersContainer = tc.querySelector(".table__filters");
  const formBtn = tc.querySelector(".table__form__opener");
  const formContainer = tc.querySelector(".table__form");
  const formCloseBtn = tc.querySelector(".table__form__close"); // new close button

  if (!filterBtn || !filtersContainer || !formBtn || !formContainer) return;

  // Initialize inert
  toggleInertWhenState(filtersContainer, "open", true);
  toggleInertWhenState(formContainer, "open", true);

  // Delegated click handling on table container
  tc.addEventListener("click", (event) => {
    const clickedFilterBtn = event.target.closest(".table__filters__btn");
    const clickedFormBtn = event.target.closest(".table__form__opener");
    const clickedFormCloseBtn = event.target.closest(".table__form__close");

    const isInsideFilters = filtersContainer.contains(event.target);
    const isInsideForm = formContainer.contains(event.target);

    // ---- Filter button ----
    if (clickedFilterBtn) {
      const isFilterOpen = filtersContainer.classList.contains("open");

      // Always close form first
      closePanel(formBtn, formContainer);

      // Toggle filter
      if (!isFilterOpen) openPanel(filterBtn, filtersContainer);
      else closePanel(filterBtn, filtersContainer);
      return;
    }

    // ---- Form open button ----
    if (clickedFormBtn) {
      const isFormOpen = formContainer.classList.contains("open");

      // Always close filters
      closePanel(filterBtn, filtersContainer);

      // Only open if closed
      if (!isFormOpen) openPanel(formBtn, formContainer);
      return;
    }

    // ---- Form close button ----
    if (clickedFormCloseBtn) {
      closePanel(formBtn, formContainer);
      return;
    }

    // ---- Click inside panels ----
    if (isInsideFilters || isInsideForm) return;

    // ---- All other clicks ----
    closeAllPanels(tc);
  });

  // ---- Click outside table closes everything ----
  document.addEventListener("click", (event) => {
    if (!tc.contains(event.target)) {
      closeAllPanels(tc);
    }
  });
};

// ----------------------------
// Module entry point
// ----------------------------
const Table = () => {
  const tableContainers = document.querySelectorAll(".table__container");
  if (!tableContainers.length) return;

  tableContainers.forEach(setupTableContainer);
};

export default Table;
