type DOMElements = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  info: HTMLElement;
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
  };
}

export {
  DOMElements,
  getDOMElements,
}
