/**
 * Centralized place to keep the references to the relevant DOM elements.
 */
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const info = document.getElementById("info");

export default {
    canvas: canvas,
    context: context,
    info: info,
}
