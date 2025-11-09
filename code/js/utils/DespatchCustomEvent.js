// dispatchEvent.js
export const dispatchCustomEvent = (eventName, detail = undefined, target = document) => {
  target.dispatchEvent(new CustomEvent(eventName, {
    detail,
    bubbles: true,   // event travels up
    composed: true,  // crosses Shadow DOM boundary
  }));
};


// on.js
export const on = (eventName, callback, options = {}, target = document) => {
  const handler = (e) => callback(e.detail, e);

  target.addEventListener(eventName, handler, options);

  // return off() cleanup
  return () => {
    target.removeEventListener(eventName, handler, options);
  };
};
