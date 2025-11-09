
export const handleKeyEvents = (
  event,
  index,
  keyFunctionHandler = null,
  htmlElementsArray,
  escapeFunction = null
) => {
  const { key } = event;
  const lastIndex = htmlElementsArray.length - 1;

  // Early handling for Escape
  if (key === 'Escape' && escapeFunction) {
    event.preventDefault();
    escapeFunction();
    return;
  }

  // Early handling for Enter / Space
  if ((key === 'Enter' || key === ' ') && keyFunctionHandler) {
    event.preventDefault();
    keyFunctionHandler();
    return;
  }

  // Navigation handling
  const actions = {
    ArrowDown: () => {
      if (index < lastIndex) htmlElementsArray[index + 1].focus();
    },
    ArrowUp: () => {
      if (index > 0) htmlElementsArray[index - 1].focus();
    },
    Home: () => htmlElementsArray[0].focus(),
    End: () => htmlElementsArray[lastIndex].focus(),
  };

  if (actions[key]) {
    event.preventDefault();
    actions[key]();
  }
};
