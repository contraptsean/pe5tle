export function sortPixels(sketch, threshold, direction) {
  sketch.loadPixels()
  const density = sketch.pixelDensity()
  const width = sketch.width * density
  const height = sketch.height * density
  const isHorizontal = direction === 'Horizontal'
  const outerCount = isHorizontal ? height : width
  const innerCount = isHorizontal ? width : height

  for (let outer = 0; outer < outerCount; outer++) {
    const linePixels = []

    for (let inner = 0; inner < innerCount; inner++) {
      const x = isHorizontal ? inner : outer
      const y = isHorizontal ? outer : inner
      const idx = (y * width + x) * 4
      linePixels.push({
        r: sketch.pixels[idx],
        g: sketch.pixels[idx + 1],
        b: sketch.pixels[idx + 2],
        a: sketch.pixels[idx + 3],
        brightness: (sketch.pixels[idx] + sketch.pixels[idx + 1] + sketch.pixels[idx + 2]) / 3,
      })
    }

    // Sort spans of pixels that exceed the brightness threshold
    let i = 0
    while (i < linePixels.length) {
      if (linePixels[i].brightness > threshold) {
        const spanStart = i
        while (i < linePixels.length && linePixels[i].brightness > threshold) i++
        const span = linePixels.slice(spanStart, i)
        span.sort((a, b) => a.brightness - b.brightness)
        for (let s = 0; s < span.length; s++) {
          linePixels[spanStart + s] = span[s]
        }
      } else {
        i++
      }
    }

    // Write sorted pixels back
    for (let inner = 0; inner < innerCount; inner++) {
      const x = isHorizontal ? inner : outer
      const y = isHorizontal ? outer : inner
      const idx = (y * width + x) * 4
      sketch.pixels[idx] = linePixels[inner].r
      sketch.pixels[idx + 1] = linePixels[inner].g
      sketch.pixels[idx + 2] = linePixels[inner].b
      sketch.pixels[idx + 3] = linePixels[inner].a
    }
  }

  sketch.updatePixels()
}
