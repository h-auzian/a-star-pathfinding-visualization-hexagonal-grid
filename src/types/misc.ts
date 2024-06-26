/**
 * Holds values from the current and previous frame. Useful for comparisons.
 */
type FrameValues<Type> = {
  previous: Type;
  current: Type;
};

/**
 * Holds an accumulated time. Useful for controls that are triggered after
 * holding a button for a certain amount of time.
 */
type AccumulatedTime = {
  requiredTime: number;
  currentTime: number;
};

export {
  FrameValues,
  AccumulatedTime,
}
