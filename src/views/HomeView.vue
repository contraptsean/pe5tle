<template>
  <div class="app-layout">
    <header class="app-header">
      <span class="app-logo">Pe5tle</span>
      <router-link class="app-about-link" to="/about">?</router-link>
    </header>

    <CanvasMain ref="canvasRef" />

    <BottomDrawer
      @mode-change="onModeChange"
      @file-change="onFileChange"
      @save="onSave"
    />
  </div>
</template>

<script setup>
import { reactive, ref, provide } from 'vue'
import CanvasMain from '@/components/CanvasMain.vue'
import BottomDrawer from '@/components/BottomDrawer.vue'
import imgUrl from '@/assets/bear.jpg'

const canvasRef = ref(null)

const sketchData = reactive({
  byteFindVal: 100,
  byteRepVal: 104,
  numRandomBytes: 10,
  quantTableByte: 125,
  limitBytesStart: 20,
  limitBytesEnd: 100,
  loadQuality: 100,
  imgSrc: imgUrl,
  imgW: 1200,
  imgH: 900,
  sketchParent: 'glitchCanvas',
  glitchType: 'hexReplace',
  glitchExtType: 'jpg',
  blended: false,
  blendMode: 'DARKEST',
  channelShiftAmount: 20,
  channelShiftChannel: 'R',
  pixelSortThreshold: 128,
  pixelSortDirection: 'Horizontal',
})

const tab = ref('hex-replace-nav')

provide('sketchData', sketchData)
provide('tab', tab)

function onFileChange(e) {
  const file = e.target.files[0]
  if (!file) return
  const img = new Image()
  sketchData.imgSrc = URL.createObjectURL(file)
  img.src = sketchData.imgSrc
  img.onload = () => {
    sketchData.imgW = img.naturalWidth
    sketchData.imgH = img.naturalHeight
  }
}

function onModeChange({ tab: newTab, type, ext }) {
  tab.value = newTab
  sketchData.glitchType = type
  sketchData.glitchExtType = ext
  sketchData.blended = false
  sketchData.loadQuality = ext === 'webp' ? 99 : 100
}

function onSave() {
  canvasRef.value?.saveImage()
}
</script>

<style scoped>
.app-layout {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  pointer-events: none;
  background: linear-gradient(to bottom, rgba(15, 18, 25, 0.7) 0%, transparent 100%);
}

.app-header > * {
  pointer-events: auto;
}

.app-logo {
  font-family: var(--font-brand);
  color: var(--accent);
  font-size: 22px;
  font-weight: 700;
  text-shadow: 0 0 24px rgba(226, 52, 171, 0.4);
}

.app-about-link {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  transition: border-color 0.2s, color 0.2s;
  background: rgba(15, 18, 25, 0.5);
}

.app-about-link:hover {
  border-color: var(--accent);
  color: var(--accent);
}
</style>
