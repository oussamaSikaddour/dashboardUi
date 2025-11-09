

const toggleActiveTab=(panel,trigger,isActive,tabIndexValue)=>{
    trigger.setAttribute("aria-selected", isActive);
  trigger.setAttribute("tabindex", tabIndexValue);
  panel.setAttribute("tabindex", tabIndexValue);
  trigger.classList.toggle("active", isActive);
}
// Toggle ARIA and visual state for a specific trigger-panel pair based on active state
const whenTriggerIsActive = (index, isActive, triggers, panels) => {
  const trigger = triggers[index];
  const panel = panels[index];
  const tabIndexValue = isActive ? "0" : "-1";
  const displayValue = isActive ? "flex" : "none";
toggleActiveTab(panel,trigger,isActive,tabIndexValue)
  panel.style.display = displayValue;
};

// When a trigger is pressed (click or key), activate its tab and focus it
const handelPressedTrigger = (index, tabTriggers, tabPanels) => {
  tabTriggers.forEach((_, i) => {
    const isActive = index === i;
    whenTriggerIsActive(i, isActive, tabTriggers, tabPanels);
  });

  // Focus the selected tab trigger
  tabTriggers[index].focus();
};

// Handle restoring or keeping the currently active tab based on its class
const handelActiveTrigger = (index, tabTriggers, tabPanels) => {
  const isActive = tabTriggers[index].classList.contains("active");
  whenTriggerIsActive(index, isActive, tabTriggers, tabPanels);
  if (isActive) tabTriggers[index].focus();
};

// Update all triggers and panels to reflect the current active tab state
const updateTabTriggerStates = (tabTriggers, tabPanels) => {
  tabTriggers.forEach((_, i) => handelActiveTrigger(i, tabTriggers, tabPanels));
};

// Manage keyboard navigation between tabs using arrow keys
const handleTabTriggersKeyEvents = (event, index, tabTriggers, tabPanels) => {
  const { key } = event;
  const currentIndex = index;
  const lastIndex = tabTriggers.length - 1;

  switch (key) {
    case 'ArrowRight':
      event.preventDefault();
      if (currentIndex < lastIndex) {
        handelPressedTrigger(currentIndex + 1, tabTriggers, tabPanels);
      }
      break;
    case 'ArrowLeft':
      event.preventDefault();
      if (currentIndex > 0) {
        handelPressedTrigger(currentIndex - 1, tabTriggers, tabPanels);
      }
      break;
    default:
      break;
  }
};

// Main initialization function for all tab containers
const Tabs = () => {
  const tabsContainers = document.querySelectorAll('.tabs__container');

  tabsContainers.forEach(tabContainer => {
    const tabTriggers = tabContainer.querySelectorAll('.tab__trigger');
    const tabPanels = tabContainer.querySelectorAll('.tab__panel');

    // Set up interaction handlers for each tab trigger
    tabTriggers.forEach((trigger, i) => {
      // Mouse click switches tab
      trigger.addEventListener("click", () => {
        tabTriggers.forEach(t => t.classList.remove('active'));
        trigger.classList.add('active');
        updateTabTriggerStates(tabTriggers, tabPanels);
      });

      // Keyboard arrow navigation
      trigger.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          handleTabTriggersKeyEvents(e, i, tabTriggers, tabPanels);
        }
      });
    });

    // Initialize first tab as active on load
    tabTriggers[0]?.classList.add("active");
    updateTabTriggerStates(tabTriggers, tabPanels);
  });
};

export default Tabs;
