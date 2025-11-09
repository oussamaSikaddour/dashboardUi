import { on } from "../utils/DespatchCustomEvent";

// Open file dialog programmatically
const triggerFileDialog = (fileInput) => {
  fileInput.click();
};

// Click handler
const handleFileClick = (e, fileInput) => {
  const btn = e.target.closest('button');
  if (btn) {
    triggerFileDialog(fileInput);
  }
};

// Keyboard handler (Enter/Space)
const handleFileKeydown = (e, fileInput) => {
  if (e.key === 'Enter' || e.key === ' ' || e.key === 'Space') {
    e.preventDefault();
    triggerFileDialog(fileInput);
  }
};



const initFileInputGroup = (fileWrapper) => {
  if (!(fileWrapper instanceof HTMLElement)) return;

  fileWrapper.classList.remove('show-uri')
  const fileInput = fileWrapper.querySelector('input[type="file"]');
  const button = fileWrapper.querySelector('button');

  button.addEventListener('click', (e) => handleFileClick(e, fileInput));
  fileWrapper.addEventListener('keydown', (e) => handleFileKeydown(e, fileInput));

  // also init show-uri listener for this wrapper
  showFileUri(fileWrapper);
};

// in your UI component
const showFileUri = (fileWrapper) => {
  on("show-uri", () => {
    const fileUriElem = fileWrapper.querySelector('.file__input__uri');
    if (!fileUriElem) return;
    fileWrapper.classList.add("show-uri");
  });
};



// Exported init function
export const manageFileInputs = (fileInputGroups) => {
  fileInputGroups.forEach((wrapper) => initFileInputGroup(wrapper));
};
