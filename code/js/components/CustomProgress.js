// Data responsibility - only handles progress value
function getProgressValue(progressElement) {
  return parseInt(progressElement.value, 10);
}

function setProgressValue(progressElement, value) {
  progressElement.value = value;
}

// Display responsibility - only handles UI updates
function updateTextDisplay(customValueElement, value) {
  customValueElement.innerHTML = `${value} <span>%</span>`;
}

function updateRotation(customProgressElement, value) {
  customProgressElement.style.setProperty("--percentage", value + "%");
}

function updateStyleClass(customProgressElement, value) {
  if (value >= 0 && value <= 50) {
    customProgressElement.classList.add("less");
  } else {
    customProgressElement.classList.remove("less");
  }
}

function updateCustomProgress(
  progressElement,
  customProgressElement,
  customValueElement
) {
  const value = getProgressValue(progressElement);

  updateTextDisplay(customValueElement, value);
  updateRotation(customProgressElement, value);
  updateStyleClass(customProgressElement, value);
}

// Input handling responsibility - only manages events

// Initialization responsibility - only sets up the components
function initializeProgressComponents() {
  const progress = document.querySelector("progress");
  const customProgress = document.querySelector(".custom__progress");
  const customValue = customProgress?.querySelector("strong");

  if (!progress || !customProgress || !customValue) return null;

  return { progress, customProgress, customValue };
}

function monitorProgressCompletion(progressElement, customProgress, customValue) {
  // Run every second to check progress
  const intervalId = setInterval(() => {
    const currentValue = getProgressValue(progressElement);

    // Ensure progress doesn’t exceed 100
    if (currentValue >= 100) {
      setProgressValue(progressElement, 100); // cap value at 100
      updateCustomProgress(progressElement, customProgress, customValue);

      // Mark as complete
      customProgress.setAttribute("aria-busy", "false");
      customProgress.classList.add("completed");

      // Stop monitoring
      clearInterval(intervalId);
      return;
    }

    // While still progressing, update the UI
    updateCustomProgress(progressElement, customProgress, customValue);
    customProgress.classList.remove("completed");
  }, 1000);
}

const CustomProgress = () => {
  const components = initializeProgressComponents();
  if (!components) return;

  document.addEventListener('show-custom-progress',(e)=>{
  const { progress, customProgress, customValue } = components;
   monitorProgressCompletion(progress,customProgress,customValue)
  })
};

export default CustomProgress;


function startProgressCountdown(
  progressElement,
  customProgressElement,
  customValueElement
) {
  const duration = 60000; // total time in ms (1 minute)
  const steps = 100; // 100 steps from 0 to 100
  const intervalTime = duration / steps; // 600 ms per step

  let value = 0;
  setProgressValue(progressElement, value);
  updateCustomProgress(
    progressElement,
    customProgressElement,
    customValueElement
  );

  const interval = setInterval(() => {
    value++;
    if (value > 100) {

      setProgressValue(progressElement, 100); // cap value at 100
      // Mark as complete
       customProgressElement.setAttribute("aria-busy", "false");
      customProgressElement.classList.add("completed");
      clearInterval(interval);
      return;
    }
    customProgressElement.classList.remove("completed");
    setProgressValue(progressElement, value);
    updateCustomProgress(
      progressElement,
      customProgressElement,
      customValueElement
    );
  }, intervalTime);
}

// Export functions with clear responsibilities
export function TestCustomProgress() {
  const components = initializeProgressComponents();
  if (!components) return;

  const { progress, customProgress, customValue } = components;
  startProgressCountdown(progress, customProgress, customValue);
}
