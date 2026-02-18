<template>
  <div ref="sketchWrapper" class="canvas-wrapper">
    <div id="p5_loading" class="canvas-loading">
      <div class="canvas-spinner"></div>
    </div>
    <div id="glitchCanvas" class="canvas-sketch"></div>
  </div>
</template>

<script setup>
/* global Glitch */
import { ref, watch, onMounted, onBeforeUnmount, inject } from 'vue'
import p5 from 'p5'
import { debounce } from '@/helpers/debounce'
import { getBlendConstant } from '@/helpers/blendMode'
import { sortPixels } from '@/helpers/pixelSort'
import { generateTimestamp } from '@/helpers/timestamp'

const sketchData = inject('sketchData')
const isMobile = ref(window.innerWidth <= 768)
let p5Instance = null

function onResize() {
  const nowMobile = window.innerWidth <= 768
  if (nowMobile !== isMobile.value) {
    isMobile.value = nowMobile
  }
}

function buildSketch() {
  const config = { ...sketchData }
  const containerWidth = window.innerWidth
  const containerHeight = window.innerHeight
  const parent = document.getElementById(config.sketchParent)
  const limitStart = config.limitBytesStart / 100
  const limitEnd = config.limitBytesEnd / 100
  const quantHex = ('0' + config.quantTableByte.toString(16)).slice(-2)
  const quality = config.loadQuality / 100
  const mobile = isMobile.value
  let originalImage

  p5Instance = new p5(function (sketch) {
    sketch.preload = () => {
      sketch.glitch = new Glitch(sketch)
      sketch.glitch.loadType(config.glitchExtType)
      sketch.glitch.loadQuality(quality)
      originalImage = sketch.loadImage(config.imgSrc)
      sketch.glitch.loadImage(config.imgSrc, () => sketch.glitched())
    }

    sketch.setup = () => {
      sketch.createCanvas(containerWidth, containerHeight)
      sketch.pixelDensity(1)
      sketch.imageMode(mobile ? sketch.CORNER : sketch.CENTER)
      sketch.glitch.errors(false)
      sketch.disableFriendlyErrors = true
      sketch.noLoop()
    }

    sketch.draw = () => {
      // Apply blend to glitch image before display
      if (config.blended) {
        const blendConst = getBlendConstant(sketch, config.blendMode)
        const img = sketch.glitch.image
        img.blend(
          originalImage,
          0, 0, img.width, img.height,
          0, 0, img.width, img.height,
          blendConst
        )
        sketch.glitch.loadImage(sketch.glitch.image)
      }

      // Save full-size bytes before resizing for download
      sketch.glitch.buffer = sketch.glitch.bytes.slice()

      // Resize and draw: width-fit on mobile, height-fit on desktop
      if (mobile) {
        sketch.glitch.image.resize(containerWidth, 0)
        sketch.image(sketch.glitch.image, 0, 0)
      } else {
        sketch.glitch.image.resize(0, containerHeight)
        sketch.image(sketch.glitch.image, containerWidth / 2, containerHeight / 2)
      }

      // Fracture: channel shift post-processing
      if (config.glitchType === 'channelShift') {
        applyChannelShift(sketch, config, originalImage, mobile, containerWidth, containerHeight)
      }

      // Sift: pixel sort post-processing
      if (config.glitchType === 'pixelSort') {
        sortPixels(sketch, config.pixelSortThreshold, config.pixelSortDirection)
      }
    }

    sketch.glitched = function () {
      // Constrain byte manipulation range for binary glitch modes
      if (['hexReplace', 'randomBytes', 'byteSwap'].includes(config.glitchType)) {
        sketch.glitch.limitBytes(limitStart, limitEnd)
      }

      switch (config.glitchType) {
        case 'hexReplace':
          sketch.glitch.replaceBytes(config.byteFindVal, config.byteRepVal)
          break
        case 'randomBytes':
          sketch.glitch.randomBytes(config.numRandomBytes)
          break
        case 'quantTable':
          sketch.glitch.replaceHex('ffdb00430101', 'ffdb004301' + quantHex)
          break
        case 'quantTable2':
          sketch.glitch.replaceHex('ffdb00430001', 'ffdb004300' + quantHex)
          break
        case 'byteSwap':
          sketch.glitch.swapBytes(config.byteFindVal, config.byteRepVal)
          break
      }

      sketch.glitch.buildImage()
    }
  }, parent)
}

function applyChannelShift(sketch, config, originalImage, mobile, containerWidth, containerHeight) {
  sketch.loadPixels()
  const shiftAmount = config.channelShiftAmount
  const density = sketch.pixelDensity()
  const width = sketch.width * density
  const height = sketch.height * density
  const pixelsCopy = sketch.pixels.slice()
  const channelIndex = config.channelShiftChannel === 'R' ? 0
    : config.channelShiftChannel === 'G' ? 1 : 2

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const sourceX = x - shiftAmount
      if (sourceX >= 0 && sourceX < width) {
        const destIdx = (y * width + x) * 4
        const srcIdx = (y * width + sourceX) * 4
        sketch.pixels[destIdx + channelIndex] = pixelsCopy[srcIdx + channelIndex]
      }
    }
  }
  sketch.updatePixels()

  // Blend original on top of the shifted result
  if (config.blended) {
    const blendConst = getBlendConstant(sketch, config.blendMode)
    sketch.blendMode(blendConst)
    const blendImg = originalImage.get()
    if (mobile) {
      blendImg.resize(containerWidth, 0)
      sketch.image(blendImg, 0, 0)
    } else {
      blendImg.resize(0, containerHeight)
      sketch.image(blendImg, containerWidth / 2, containerHeight / 2)
    }
    sketch.blendMode(sketch.BLEND)
  }
}

function saveImage() {
  if (!p5Instance) return
  const ts = generateTimestamp()

  if (sketchData.glitchType === 'channelShift' || sketchData.glitchType === 'pixelSort') {
    // Pixel-based modes: save directly from canvas
    p5Instance.saveCanvas('pe5tle_' + ts, 'jpg')
  } else {
    // Byte-based modes: rebuild full-size image from buffer
    p5Instance.glitch.bytes = p5Instance.glitch.buffer.slice()
    p5Instance.glitch.buildImage((img) => img.save('pe5tle_' + ts))
  }
}

// Debounced rebuild: destroy old sketch and create new one
const debouncedRebuild = debounce(() => {
  if (p5Instance) p5Instance.remove()
  buildSketch()
}, 500)

// Watch config changes and breakpoint changes
watch(sketchData, () => debouncedRebuild(), { deep: true })
watch(isMobile, () => debouncedRebuild())

onMounted(() => {
  window.addEventListener('resize', onResize)
  buildSketch()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  debouncedRebuild.cancel()
  if (p5Instance) p5Instance.remove()
})

defineExpose({ saveImage })
</script>

<style scoped>
.canvas-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}

.canvas-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  pointer-events: none;
}

.canvas-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--bg-elevated);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.canvas-sketch {
  width: 100%;
  height: 100%;
}
</style>
