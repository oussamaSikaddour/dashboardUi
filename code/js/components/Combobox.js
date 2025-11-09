// ===========================================================
// Combobox Component — Optimized Version
// ===========================================================
// Purpose: Accessible autocomplete Combobox with modular design
// Dependencies: setAriaAttributes, debounce, positionRelativeTo
// ===========================================================

import { setAriaAttributes } from "../utils/Aria";
import { debounce } from "../utils/General";
import { positionRelativeTo } from "../utils/positioning";

// ===========================================================
// 1️⃣ DOM UTILITIES
// ===========================================================
const comboboxList = document.querySelector(".combobox__list"); // shared floating listbox
let activeCombobox = null; // keep track of currently active combobox

const getComboboxElements = () => document.querySelectorAll(".combobox");
const getButtonFromCombobox = (node) => node.querySelector("button");
const getInputFromCombobox = (node) => node.querySelector(".input");
const getAllListItems = (listBox) => Array.from(listBox.querySelectorAll("li"));
const getVisibleListItems = (listBox) =>
  getAllListItems(listBox).filter((li) => !li.classList.contains("hide"));
const getActiveListItem = (listBox) => listBox.querySelector("li.active");

const getComboboxElementListContent = (el) => {
  const contentEl = el.querySelector("ul[role='listbox']");
  return contentEl ? contentEl.innerHTML.trim() : "";
};

const setComboboxListContent = (listBox, content) => {
  listBox.innerHTML = content;
};

// ===========================================================
// 2️⃣ STATE MANAGEMENT
// ===========================================================
const extractTextFromLi = (li) =>
  Array.from(li.querySelectorAll("div"))
    .map((div) => div.textContent.trim())
    .join(" ")
    .toLowerCase();

const getDivTextFromLiByPosition = (li, pos) =>
  li.querySelectorAll("div")[pos - 1]?.textContent.trim() || "";

const setActiveListItem = (item, input, allItems) => {
  input.value = getDivTextFromLiByPosition(item, 2);
  allItems.forEach((li) => li.classList.remove("active"));
  item.classList.add("active");
  item.setAttribute("tabindex", "0");
  item.focus();
};

const clearActiveItems = (listBox) => {
  getAllListItems(listBox).forEach((li) => {
    li.classList.remove("active");
    li.setAttribute("tabindex", "-1");
  });
};

// ===========================================================
// 3️⃣ FILTERING
// ===========================================================
const filterOptions = (value, listBox) => {
  const filter = value.toLowerCase();
  let hasVisible = false;

  getAllListItems(listBox).forEach((item) => {
    const match = extractTextFromLi(item).includes(filter);
    item.classList.toggle("hide", !match);
    if (match) hasVisible = true;
  });

  listBox.classList.toggle("open", hasVisible);
};

// ===========================================================
// 4️⃣ NAVIGATION
// ===========================================================
const getIndex = (item, items) => items.indexOf(item);
const nextIndex = (i, max) => (i < max ? i + 1 : 0);
const prevIndex = (i, max) => (i > 0 ? i - 1 : max);

const handleKeyEvents = (event, listBox, button, input, state, toggleFn) => {
  const listItems = getVisibleListItems(listBox);
  if (!listItems.length) return;

  const active = getActiveListItem(listBox);
  const currentIndex = active ? getIndex(active, listItems) : -1;
  const lastIndex = listItems.length - 1;

  switch (event.key) {
    case "Escape":
    case "Enter":
    case " ":
      event.preventDefault();
      toggleFn(false);
      break;
    case "ArrowDown":
      event.preventDefault();
      setActiveListItem(listItems[nextIndex(currentIndex, lastIndex)], input, listItems);
      break;
    case "ArrowUp":
      event.preventDefault();
      setActiveListItem(listItems[prevIndex(currentIndex, lastIndex)], input, listItems);
      break;
    case "Home":
      event.preventDefault();
      setActiveListItem(listItems[0], input, listItems);
      break;
    case "End":
      event.preventDefault();
      setActiveListItem(listItems[lastIndex], input, listItems);
      break;
  }
};

// ===========================================================
// 5️⃣ ACTIVE COMBOBOX TRACKING
// ===========================================================
const setActiveCombobox = (combobox, input, button, state) => {
  if (activeCombobox && activeCombobox.combobox !== combobox) {
    const { combobox: prev, button: prevBtn, input: prevInput, state: prevState } = activeCombobox;
    toggleListbox(prev, false, comboboxList, prevBtn, prevInput, prevState);
  }
  activeCombobox = { combobox, input, button, state };
};

const clearActiveCombobox = () => (activeCombobox = null);

// ===========================================================
// 6️⃣ UI STATE — Toggle & Position Listbox
// ===========================================================
const toggleListbox = (combobox, isShown, listBox, button, input, state) => {
  if (isShown) {
    setActiveCombobox(combobox, input, button, state);
  } else if (activeCombobox?.combobox === combobox) {
    clearActiveCombobox();
  }

  listBox.classList.toggle("show", isShown);
  input.setAttribute("aria-expanded", isShown);
  button.setAttribute("aria-expanded", isShown);
  setAriaAttributes(isShown ? "false" : "true", isShown ? 0 : -1, listBox);
  state.isShown = isShown;

  const content = getComboboxElementListContent(combobox);
  if (!content) return;

  if (isShown) {
    setComboboxListContent(listBox, content);
    positionRelativeTo(input, listBox, 4);
  } else {
    clearActiveItems(listBox);
    setComboboxListContent(listBox, "");
  }
};

// ===========================================================
// 7️⃣ EVENT INITIALIZATION
// ===========================================================
const handleInputKeydown = (input, listBox) =>
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const first = listBox.querySelector("li:not(.hide)");
      if (first) setActiveListItem(first, input, getAllListItems(listBox));
    }
  });

const initializeFocusEvents = (listBox) => {
  document.addEventListener("focusin", (e) => {
    const combobox = e.target.closest(".combobox");
    if (combobox) {
      const input = getInputFromCombobox(combobox);
      const button = getButtonFromCombobox(combobox);
      const state = { isShown: false };
      setActiveCombobox(combobox, input, button, state);
      toggleListbox(combobox, true, listBox, button, input, state);
    }
  });

  document.addEventListener("focusout", (e) => {
    if (
      activeCombobox &&
      !activeCombobox.combobox.contains(e.relatedTarget) &&
      !listBox.contains(e.relatedTarget)
    ) {
      const { combobox, button, input, state } = activeCombobox;
      toggleListbox(combobox, false, listBox, button, input, state);
    }
  });
};

const initializeInputEvents = (listBox) => {
  const onInput = debounce((e) => filterOptions(e.target.value.trim(), listBox), 300);
  document.addEventListener("input", (e) => {
    if (activeCombobox?.input === e.target) onInput(e);
  });
  document.addEventListener("keydown", (e) => {
    if (activeCombobox?.input === e.target) handleInputKeydown(e.target, listBox);
  });
};

const initializeKeyboardEvents = (listBox) => {
  listBox.addEventListener("keydown", (e) => {
    if (!activeCombobox) return;
    const { input, button, state, combobox } = activeCombobox;
    handleKeyEvents(e, listBox, button, input, state, (show) =>
      toggleListbox(combobox, show, listBox, button, input, state)
    );
  });
};

// ===========================================================
// 8️⃣ GLOBAL CLICK HANDLERS
// ===========================================================
comboboxList.addEventListener("click", (e) => {
  if (!activeCombobox) return;
  const { combobox, input, button, state } = activeCombobox;
  const li = e.target.closest("li");
  if (li) {
    input.value = getDivTextFromLiByPosition(li, 2);
    filterOptions(input.value, comboboxList);
    toggleListbox(combobox, false, comboboxList, button, input, state);
  }
});

document.addEventListener("click", (e) => {
  if (
    activeCombobox &&
    !comboboxList.contains(e.target) &&
    !activeCombobox.combobox.contains(e.target)
  ) {
    const { combobox, button, input, state } = activeCombobox;
    toggleListbox(combobox, false, comboboxList, button, input, state);
  }
});

// ===========================================================
// 9️⃣ MAIN INITIALIZER
// ===========================================================
const initializeCombobox = (listBox) => {
  initializeFocusEvents(listBox);
  initializeInputEvents(listBox);
  initializeKeyboardEvents(listBox);
};

// ===========================================================
// 🔟 EXPORTABLE INITIALIZER
// ===========================================================
const Combobox = () => {
  getComboboxElements().forEach((combobox) => {
    const input = getInputFromCombobox(combobox);
    const button = getButtonFromCombobox(combobox);
    const state = { isShown: false };

    // Button click toggles listbox
    button.addEventListener("click", () => {
      toggleListbox(combobox, !state.isShown, comboboxList, button, input, state);
    });
  });

  initializeCombobox(comboboxList);
};

export default Combobox;
