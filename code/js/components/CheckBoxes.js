// --- 1. Update checkbox state (native + ARIA) ---
const updateCheckboxState = (checkbox, isChecked) => {
  checkbox.checked = isChecked;                  // native state
  checkbox.setAttribute('aria-checked', isChecked); // ARIA
};

// --- 2. Toggle checkbox state ---
const toggleCheckbox = (checkbox) => {
  updateCheckboxState(checkbox, !checkbox.checked);
};

// --- 3. Handle click events ---
const handleCheckboxClick = (e, checkboxes) => {
  const checkbox = e.target.closest('[role="checkbox"]');
  if (checkbox && checkboxes.includes(checkbox) && !checkbox.disabled) {
    toggleCheckbox(checkbox);
  }
};

// --- 4. Handle keyboard (spacebar) ---
const handleCheckboxKeydown = (e, checkboxLabels, checkboxes) => {
  if (e.key === ' ' || e.key === 'Space') {
    e.preventDefault();
    const label = e.target.closest('label');
    if (!label) return;

    const index = checkboxLabels.indexOf(label);
    if (index > -1 && !checkboxes[index].disabled) {
      toggleCheckbox(checkboxes[index]);
    }
  }
};

// --- 5. Initialize a single checkbox group ---
const initCheckboxGroup = (groupe) => {

if (!(groupe instanceof HTMLElement)) return;
  const checkboxLabels = Array.from(groupe.querySelectorAll('label'));
  const checkboxes = Array.from(groupe.querySelectorAll("input[type='checkbox']"));

  // Add ARIA roles and initial state
  checkboxes.forEach(cb => {
    cb.setAttribute('aria-checked', cb.checked);
  });

  // Click handler
  groupe.addEventListener('click', e => handleCheckboxClick(e, checkboxes));

  // Keyboard handler
  checkboxLabels.forEach(label => {
    label.addEventListener('keydown', e => handleCheckboxKeydown(e, checkboxLabels, checkboxes));
  });
};

// --- 6. Initialize all checkbox groups ---
export const manageCheckBoxes = (checkBoxesGroups) => {

  checkBoxesGroups.forEach((checkBoxesGroup) =>initCheckboxGroup(checkBoxesGroup));
};
