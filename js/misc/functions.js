/**
 * Keeps the value between min and max, both inclusive.
 */
function keepBetweenValues(min, value, max) {
    if (value < min) {
        return min;
    } else if (value > max) {
        return max;
    } else {
        return value;
    }
}

export { keepBetweenValues };
