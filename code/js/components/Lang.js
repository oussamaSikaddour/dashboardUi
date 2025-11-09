// Import key event handler helper and custom event dispatcher
import { dispatchCustomEvent } from "../utils/DespatchCustomEvent";
import { handleKeyEvents } from "../utils/KeyEventHandlers";

// Storage management
const saveLanguageToStorage = (language) => {
  localStorage.setItem('language', language);
};

const getLanguageFromStorage = () => {
  return localStorage.getItem('language') || 'Fr'; // Default to French
};

// DOM manipulation utilities
const toggleRtlClass = (language) => {
  document.documentElement.classList.toggle('rtl', language === 'Ar');
};

const setAriaAttributes = (langBtn, langMenu, isOpen) => {
  langBtn.setAttribute("aria-expanded", isOpen);
  langMenu.setAttribute("aria-hidden", !isOpen);
};

const toggleMenuVisibility = (langBtn, langMenu) => {
  const isOpen = langMenu.classList.toggle("open");
  setAriaAttributes(langBtn, langMenu, isOpen);
  return isOpen;
};

// Language data utilities
const findLanguageIndex = (languageCode, languages) => {
  return languages.findIndex((language) => language.lang === languageCode);
};

const getSelectedLanguage = (languageCode, languages) => {
  const index = findLanguageIndex(languageCode, languages);
  return languages[index];
};

const getRemainingLanguages = (selectedLang, languages) => {
  return languages.filter((language) => language.lang !== selectedLang);
};

// UI rendering functions
const createLanguageButtonHTML = (language) => {
  return `
    <div class="lang">
      <p>${language.lang}</p>
      <img src="${language.flag}" alt="${language.lang} language" />
    </div>
  `;
};

const createMenuItemHTML = (language) => {
  return `
    <li role="menuitem" class="lang__menu__item" tabindex="0">
      <div class="lang">
        <p>${language.lang}</p>
        <img src="${language.flag}" alt="${language.lang} language" />
      </div>
    </li>
  `;
};

const updateLanguageButtons = (selectedLanguage, langBtns) => {
  langBtns.forEach((langBtn) => {
    langBtn.innerHTML = createLanguageButtonHTML(selectedLanguage);
  });
};

const updateLanguageMenus = (remainingLanguages, langMenus) => {
  langMenus.forEach(langMenu => {
    langMenu.innerHTML = remainingLanguages.map(createMenuItemHTML).join("");
  });
};

// Language preference management
const setLanguagePreference = (language) => {
  saveLanguageToStorage(language);
  toggleRtlClass(language);
};

const populateLangMenu = (languages, selectedLang) => {
  const selectedLanguage = getSelectedLanguage(selectedLang, languages);
  const remainingLanguages = getRemainingLanguages(selectedLang, languages);

  const langMenus = document.querySelectorAll(".lang__menu");
  const langBtns = document.querySelectorAll(".lang__btn");

  updateLanguageButtons(selectedLanguage, langBtns);
  updateLanguageMenus(remainingLanguages, langMenus);
  setLanguagePreference(selectedLang);
};

// Event handlers
const handleLangBtnClick = (langBtn, langMenu) => {
  toggleMenuVisibility(langBtn, langMenu);
  const langMenuItems = Array.from(langMenu.querySelectorAll('.lang__menu__item'));
  langMenuItems[1]?.focus(); // Optional: focus second item after opening
};

const getSelectedLanguageFromMenuItem = (menuItem) => {
  return menuItem?.querySelector("p").textContent;
};

const selectLanguage = (index, langBtn, langMenu, languages) => {
  const langMenuItems = Array.from(langMenu.querySelectorAll('.lang__menu__item'));
  const selectedLang = getSelectedLanguageFromMenuItem(langMenuItems[index]);

  populateLangMenu(languages, selectedLang);
  toggleMenuVisibility(langBtn, langMenu);
  langBtn.focus();

  dispatchCustomEvent("set-locale", { lang: selectedLang });
};

const handleMenuItemInteraction = (event, langBtn, langMenu, languages) => {
  const langMenuItem = event.target.closest('.lang__menu__item');
  if (!langMenuItem) return;

  const langMenuItems = Array.from(langMenu.querySelectorAll('.lang__menu__item'));
  const index = langMenuItems.indexOf(langMenuItem);

  if (event.type === "keydown") {
    handleKeyEvents(event, index, () => selectLanguage(index, langBtn, langMenu, languages), langMenuItems);
  } else if (event.type === "click") {
    selectLanguage(index, langBtn, langMenu, languages);
  }
};

// Initialization functions
const initializeLanguageMenu = (langMenuContainer, languages) => {
  const langMenu = langMenuContainer.querySelector(".lang__menu");
  const langBtn = langMenuContainer.querySelector(".lang__btn");

  if (!langBtn) return;

  const selectedLang = getLanguageFromStorage();
  populateLangMenu(languages, selectedLang);

  langBtn.addEventListener('click', () => handleLangBtnClick(langBtn, langMenu));

  const eventHandler = (event) => {
    handleMenuItemInteraction(event, langBtn, langMenu, languages);
  };

  langMenuContainer.addEventListener('keydown', eventHandler);
  langMenuContainer.addEventListener('click', eventHandler);
};

// Main function that initializes all language menus on the page
const Lang = () => {
  const languages = [
    { lang: 'En', flag: './assets/img/en.png' },
    { lang: 'Fr', flag: './assets/img/fr.png' },
    { lang: 'Ar', flag: './assets/img/ar.png' },
  ];

  const langMenuContainers = document.querySelectorAll(".lang__menu__container");
  langMenuContainers.forEach(langMenuContainer => {
    initializeLanguageMenu(langMenuContainer, languages);
  });
};

export default Lang;