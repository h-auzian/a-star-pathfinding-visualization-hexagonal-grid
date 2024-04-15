/**
 * Application state. This holds all relevant data in a centralized place.
 * Each frame, the `update` method will make changes to this state, while the
 * 'draw' method will draw the canvas according to the state values.
 */
let state = {
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
            x: 200,
            y: 0,
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
    },
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
    controls: {
        scroll: {
            previous: false,
            current: false,
        },
        scale: {
            previous: 0,
            current: 0,
        },
    },
};

export default state;
