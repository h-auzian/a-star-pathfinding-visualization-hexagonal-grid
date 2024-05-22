type DOMElements = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  info: HTMLElement;
  options: {
    toggle: HTMLElement;
    container: HTMLElement;
    buttons: {
      algorithm: HTMLSpanElement;
      calculation: HTMLSpanElement;
    };
  };
};

/**
 * Gets the references to the relevant DOM elements.
 */
function getDOMElements(): DOMElements {
  const canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("canvas")!;

  return {
    canvas: canvas,
    context: canvas.getContext("2d")!,
    info: document.getElementById("info")!,
    options: {
      toggle: document.getElementById("gear")!,
      container: document.getElementById("options")!,
      buttons: {
        algorithm: document.getElementById("algorithm-option")!,
        calculation: document.getElementById("calculation-option")!,
      },
    },
  };
}

export {
  DOMElements,
  getDOMElements,
}
