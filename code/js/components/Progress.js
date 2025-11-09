// Initializes ARIA attributes for accessibility on the progress element
const enableProgress = (progress) => {
  progress.setAttribute("role", "progressbar");
  progress.setAttribute("aria-valuenow", 0);
  progress.setAttribute("aria-live", "polite");
};

// Updates the progress bar visually and updates ARIA attribute
const updateProgress = (progress, progressState) => {
  progressState = Math.round(progressState); // Round for cleaner values
  progress.setAttribute("aria-valuenow", progressState);
  progress.style.setProperty("--progress", `${progressState}%`); // This drives the CSS animation
};

// Simulates progress animation over time and supports cancellation
const simulateProgress = (progress, duration = 0, onCancel = null) => {
  let progressState = 0;
  progress.setAttribute("aria-busy", "true");
  updateProgress(progress, progressState);

  const startTime = Date.now();
  const endTime = startTime + duration;

  const intervalTimer = setInterval(() => {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;

    // Calculate percentage completion
    progressState = Math.min(Math.round((elapsedTime / duration) * 100), 100);
    updateProgress(progress, progressState);

    if (currentTime >= endTime) {
      clearInterval(intervalTimer);
      progress.setAttribute("aria-busy", "false");
      closeProgressModal();
    }
  }, 200); // Updates every 200ms

  // If a cancel callback is provided, give it the cancel logic
  if (onCancel) {
    onCancel(() => {
      clearInterval(intervalTimer); // Stop progress loop
      progress.setAttribute("aria-busy", "false");
      updateProgress(progress, 0); // Reset progress to 0
      closeProgressModal(); // Close UI
    });
  }
};

// Hides the progress modal with a delay (after completion or cancel)
const closeProgressModal = () => {
  const progressContainer = document.querySelector(".progress__container");
  if (progressContainer) {
    setTimeout(() => progressContainer.classList.remove("show"), 2000); // Hide after 2s
  }
};

// Main component function
const Progress = () => {
  const uploadButton = document.querySelector(".uploadFile");
  const progressContainer = document.querySelector(".progress__container");
  const progress = document.querySelector(".progress");
  const cancelButton = document.querySelector(".progress__closer");

  let cancelUpload = null;

  // Handle upload button click
  uploadButton?.addEventListener("click", () => {
    progressContainer.classList.add("show"); // Show the modal
    enableProgress(progress); // Initialize ARIA attrs

    // Get duration from button data attribute or use default
    const progressDuration = parseInt(uploadButton.dataset.progress, 10) || 5000;

    // Start simulating progress
    simulateProgress(progress, progressDuration, (cancel) => {
      cancelUpload = cancel; // Store cancel function for later use
    });
  });

  // Cancel button listener
  cancelButton?.addEventListener("click", () => {
    if (cancelUpload) {
      cancelUpload(); // Invoke cancel logic
    }
  });
};

export default Progress;
