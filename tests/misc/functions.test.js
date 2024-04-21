import { keepBetweenValues } from "../../js/misc/functions";

test.each([
    [10, 9, 20, 10],
    [10, 10, 20, 10],
    [10, 20, 20, 20],
    [10, 21, 20, 20],
])('Keep between values: (%i, %i, %i) -> %i', function(min, value, max, expected) {
    expect(keepBetweenValues(min, value, max)).toBe(expected);
});
