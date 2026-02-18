export function getBlendConstant(sketch, modeName) {
  const modes = {
    LIGHTEST: sketch.LIGHTEST,
    DARKEST: sketch.DARKEST,
    DIFFERENCE: sketch.DIFFERENCE,
    MULTIPLY: sketch.MULTIPLY,
    EXCLUSION: sketch.EXCLUSION,
    SCREEN: sketch.SCREEN,
  }
  return modes[modeName] ?? sketch.BLEND
}
