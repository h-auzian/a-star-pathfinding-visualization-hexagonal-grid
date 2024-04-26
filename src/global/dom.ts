/**
 * Centralized place to keep the references to the relevant DOM elements.
 */
const canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("canvas")!;
const context: CanvasRenderingContext2D = canvas.getContext("2d")!;
const info: HTMLElement = document.getElementById("info")!;

export default {
  canvas: canvas,
  context: context,
  info: info,
}
