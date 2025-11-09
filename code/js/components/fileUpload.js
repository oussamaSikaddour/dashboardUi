// Define a function component for managing custom file input behavior
const FileInput = () => {
    // Select the main container that wraps the custom file input group
    const fileGroup = document.querySelector(".upload__group"); 

    // Inside that container, select the actual <input type="file"> element
    const inputFile = fileGroup?.querySelector("input[type='file']");

    // If the container exists, add a keypress event listener to it
    fileGroup?.addEventListener("keypress", event => {
        const key = event.key || event.keyCode; // Get the pressed key or its code

        // If the key is spacebar, Enter (as string or code), trigger the input
        if (key === " " || key === "Enter" || key === 13) {
            event.preventDefault(); // Prevent default key behavior (e.g., scrolling or submitting)
            inputFile.click(); // Programmatically trigger the file input click to open file picker
        }
    });
}

// Export the FileInput function as default so it can be used in main.js or elsewhere
export default FileInput;
