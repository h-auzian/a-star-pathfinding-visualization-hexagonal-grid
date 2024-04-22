const RADIANS = Math.PI / 180;
const HEXAGON_RADIUS = 50;
const HEXAGON_INNER_HORIZONTAL_DISTANCE = Math.cos(60 * RADIANS) * HEXAGON_RADIUS;
const HEXAGON_HORIZONTAL_DISTANCE = HEXAGON_RADIUS + HEXAGON_INNER_HORIZONTAL_DISTANCE;
const HEXAGON_VERTICAL_DISTANCE = Math.sin(60 * RADIANS) * HEXAGON_RADIUS;

/**
 * Returns the 6 vertices from an hexagon with a given center.
 */
function getHexagonPoints(centerX, centerY) {
    let points = [];

    for (let i = 0; i < 6; i++) {
        let angle = 60 * i * RADIANS;
        const x = Math.cos(angle) * HEXAGON_RADIUS + centerX;
        const y = Math.sin(angle) * HEXAGON_RADIUS + centerY;
        points.push({x, y});
    }

    return points;
}

export {
    HEXAGON_RADIUS,
    HEXAGON_INNER_HORIZONTAL_DISTANCE,
    HEXAGON_HORIZONTAL_DISTANCE,
    HEXAGON_VERTICAL_DISTANCE,
    getHexagonPoints,
};
