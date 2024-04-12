const RADIANS = Math.PI / 180;
const HEXAGON_RADIUS = 50;

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

export {getHexagonPoints};
