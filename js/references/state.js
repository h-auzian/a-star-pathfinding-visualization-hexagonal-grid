/**
 * Application state. This holds all relevant data in a centralized place.
 * Each frame, the `update` method will make changes to this state, while the
 * 'draw' method will draw the canvas according to the state values.
 */
export default {
    camera: {
        size: {
            raw: {
                width: 0,
                height: 0,
            },
            scaled: {
                width: 0,
                height: 0,
            },
        },
        center: {
            x: 0,
            y: 0,
        },
        rectangle: {
            scaled: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
            },
        },
        scrollPosition: {
            x: 0,
            y: 0,
        },
        scale: {
            value: 1,
            destination: 1,
            speed: 0,
        },
    },
    map: {
        width: 30,
        height: 20,
        tiles: [],
        boundaries: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
        },
    },
    input: {
        mouse: {
            position: {
                window: {
                    x: 0,
                    y: 0,
                },
                map: {
                    x: 0,
                    y: 0,
                },
            },
            buttons: {
                middle: false,
            },
            wheel: {
                y: 0,
            },
        },
        keyboard: {
            buttons: {
                w: false,
                a: false,
                s: false,
                d: false,
            },
        },
    },
    controls: {
        scroll: {
            general: {
                previous: false,
                current: false,
            },
            individual: {
                up: {
                    previous: false,
                    current: false,
                },
                left: {
                    previous: false,
                    current: false,
                },
                down: {
                    previous: false,
                    current: false,
                },
                right: {
                    previous: false,
                    current: false,
                },
            },
        },
        scale: {
            previous: 0,
            current: 0,
        },
    },
    debug: {
        map: {
            visibleTiles: false,
            boundaries: false,
        },
    },
};
