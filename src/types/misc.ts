/**
 * Holds values from the current and previous frame. Useful for comparisons.
 */
type FrameValues<Type> = {
  previous: Type;
  current: Type;
};

export {
  FrameValues,
}
