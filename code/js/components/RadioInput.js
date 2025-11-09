// Update checked state and ARIA attributes
const updateRadioState = (radio, radiosInGroup) => {
  radiosInGroup.forEach(r => {
    const isSelected = r === radio;
    r.checked = isSelected;                       // update checked state
    r.setAttribute('aria-checked', isSelected);  // update ARIA
  });
};

// Click handler
const handleRadioClick = (e, radios) => {
  const radio = e.target.closest('[role="radio"]');
  if (radio && !radio.disabled) {
    updateRadioState(radio, radios);
  }
};

// Keyboard handler (spacebar to select)
const handleRadioKeydown = (e, labels, radios) => {
  if (e.key === ' ' || e.key === 'Spacebar') {
    const label = e.target.closest('label');
    if (label) {
      e.preventDefault();
      const index = labels.indexOf(label);
      if (index > -1 && !radios[index].disabled) {
        updateRadioState(radios[index], radios);
      }
    }
  }
};

// Initialize radio groups
const initRadioInputsGroup = (radioGroup) => {
    if (!(radioGroup instanceof HTMLElement)) return;
    const labels = Array.from(radioGroup.querySelectorAll("label")); // ← fix here
    const radios = radioGroup.querySelectorAll("input[type='radio']");
     radios.forEach(r => {
      r.setAttribute('aria-checked', r.checked);
    });
    radioGroup.addEventListener('click', e => handleRadioClick(e, radios));
    radioGroup.addEventListener('keydown', e => handleRadioKeydown(e, labels, radios));
};


export const manageRadioInputs = (radioInputGroups) => {

  radioInputGroups.forEach((radioInputGroup)=>initRadioInputsGroup(radioInputGroup));
};
