import { loadModule } from "./LoadModule.js";

/**
 * Configuration for UI modules to dynamically import.
 * Each object contains:
 *  - selector: DOM element to check for existence
 *  - fileName: module file to import
 *  - exports: array of exported functions to call with arguments
 */
const UI_MODULES = [
  {
    selector: ".tooltip",
    fileName: "Tooltip",
    exports: [
      { exportType: "default", functionName: "Tooltip", functionArguments: [] }
    ]
  },
  {
    selector: ".nav",
    fileName: "Header",
    exports: [
      { exportType: "default", functionName: "Navigation", functionArguments: [] }
    ]
  },
  {
    selector: ".modal",
    fileName: "Modal",
    exports: [
      { exportType: "default", functionName: "Modal", functionArguments: [] }
    ]
  },
  {
    selector: ".lang__menu__container",
    fileName: "Lang",
    exports: [
      { exportType: "default", functionName: "Lang", functionArguments: [] }
    ]
  },
  {
    selector: ".radio__group > .choices",
    fileName: "RadioInput",
    exports: [
      { exportType: "named", functionName: "manageRadioInputs", functionArguments: [document.querySelectorAll('.radio__group > .choices')] }
    ]
  },
  {
    selector: ".checkbox__group > .choices",
    fileName: "CheckBoxes",
    exports: [
      { exportType: "named", functionName: "manageCheckBoxes", functionArguments: [document.querySelectorAll('.checkbox__group > .choices')] }
    ]
  },
  {
    selector: ".file__input__item",
    fileName: "FileInputs",
    exports: [
      { exportType: "default", functionName: "manageFileInputs", functionArguments: [] }
    ]
  },
  {
    selector: ".sidebar",
    fileName: "sidebar",
    exports: [
      { exportType: "default", functionName: "Sidebar", functionArguments: [] }
    ]
  }
  ,
  {
    selector: ".accordion",
    fileName: "Accordion",
    exports: [
      { exportType: "default", functionName: "Accordion", functionArguments: [] }
    ]
  }
  ,
  {
    selector: ".dialog",
    fileName: "Dialog",
    exports: [
      { exportType: "default", functionName: "Dialog", functionArguments: [] }
    ]
  }
  ,
  {
    selector: ".errors__container",
    fileName: "ErrorsNotifications",
    exports: [
      { exportType: "default", functionName: "ErrorsNotifications", functionArguments: [] }
    ]
  }
  ,
  {
    selector: ".toast__container",
    fileName: "Toast",
    exports: [
      { exportType: "default", functionName: "Toast", functionArguments: [] }
    ]
  },
  {
    selector: ".form",
    fileName: "Form",
    exports: [
      { exportType: "named", functionName: "focusNonHiddenInput", functionArguments: [] },
      { exportType: "named", functionName: "clearErrorsOnFocus", functionArguments: [] },
      // { exportType: "named", functionName: "slide", functionArguments: [['slide-register-form-step']] },
      { exportType: "named", functionName: "slide", functionArguments: [] },
    ]
  },
  {
    selector: "progress",
    fileName: "CustomProgress",
    exports: [
      { exportType: "default", functionName: "CustomProgress", functionArguments: [] },
      { exportType: "named", functionName: "TestCustomProgress", functionArguments: [] },

    ]
  },
  {
    selector: ".combobox__input",
    fileName: "Combobox",
    exports: [
      { exportType: "default", functionName: "Combobox", functionArguments: [] },
    ]
  },
  {
    selector: ".tabs__container",
    fileName: "Tabs",
    exports: [
      { exportType: "default", functionName: "Tabs", functionArguments: [] },
    ]
  }
  ,
  {
    selector: ".table__container",
    fileName: "Table",
    exports: [
      { exportType: "default", functionName: "Table", functionArguments: [] },
    ]
  }
];

/**
 * Initializes all UI components dynamically based on DOM presence.
 */
export const initUIComponents = async () => {
  const loadPromises = UI_MODULES
    .filter(config => document.querySelector(config.selector)) // Only load if element exists
    .map(config => loadModule(config.fileName, config.exports));

  return Promise.all(loadPromises);
};
