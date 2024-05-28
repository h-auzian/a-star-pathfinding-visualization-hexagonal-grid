type DOMElements = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  info: {
    toggle: HTMLElement;
    container: HTMLElement;
  };
  explanation: {
    toggle: HTMLElement;
    container: HTMLElement;
  };
  options: {
    toggle: HTMLElement;
    container: HTMLElement;
    buttons: {
      algorithm: HTMLElement;
      calculation: HTMLElement;
      obstacleFrequency: HTMLElement;
      regenerateMap: HTMLElement;
      theme: HTMLElement;
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
    info: {
      toggle: document.getElementById("info-icon")!,
      container: document.getElementById("info")!,
    },
    explanation: {
      toggle: document.getElementById("explanation-icon")!,
      container: document.getElementById("explanation")!,
    },
    options: {
      toggle: document.getElementById("gear-icon")!,
      container: document.getElementById("options")!,
      buttons: {
        algorithm: document.getElementById("algorithm-option")!,
        calculation: document.getElementById("calculation-option")!,
        obstacleFrequency: document.getElementById("obstacle-frequency-option")!,
        regenerateMap: document.getElementById("regenerate-map-option")!,
        theme: document.getElementById("theme-option")!,
      },
    },
  };
}

export {
  DOMElements,
  getDOMElements,
}
