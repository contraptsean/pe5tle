<template>
  <div
    ref="drawerEl"
    class="drawer"
    :class="{ 'drawer--expanded': isExpanded, 'drawer--dragging': isDragging }"
    :style="drawerStyle"
  >
    <!-- Drag Handle -->
    <div
      class="drawer__header"
      @touchstart.passive="onTouchStart"
      @touchmove.passive="onTouchMove"
      @touchend="onTouchEnd"
      @mousedown="onMouseDown"
    >
      <div class="drawer__handle">
        <div class="drawer__handle-bar"></div>
      </div>
    </div>

    <!-- Summary Bar (always visible) -->
    <div class="drawer__summary" @click="toggleDrawer">
      <span class="drawer__mode-badge">{{ currentModeName }}</span>
      <div class="drawer__quick-actions">
        <label class="btn drawer__icon-btn" for="fileUploadCollapsed">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
            <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
            <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
          </svg>
        </label>
        <input
          id="fileUploadCollapsed"
          type="file"
          accept="image/png, image/jpeg"
          style="display: none"
          @change="emit('file-change', $event)"
          @click.stop
        />
        <button class="btn drawer__icon-btn" @click.stop="emit('save')">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Content (always rendered, clipped by overflow) -->
    <div class="drawer__content">

      <!-- MODE SELECTOR -->
      <section class="drawer__section">
        <h3 class="drawer__section-title">Mode</h3>
        <div class="mode-grid">
          <button
            v-for="mode in modes"
            :key="mode.id"
            class="mode-chip"
            :class="{ 'mode-chip--active': isActiveMode(mode) }"
            @click="selectMode(mode)"
          >
            <span class="mode-chip__icon">{{ mode.icon }}</span>
            <span class="mode-chip__name">{{ mode.name }}</span>
            <span class="mode-chip__desc">{{ mode.desc }}</span>
          </button>
        </div>
      </section>

      <!-- MODE-SPECIFIC CONTROLS -->
      <section class="drawer__section">
        <h3 class="drawer__section-title">Controls</h3>
        <HexReplaceControls v-if="tab === 'hex-replace-nav'" />
        <RandomBytesControls v-if="tab === 'random-replace-nav'" />
        <QuantTableControls v-if="tab === 'quant-table-nav'" />
        <ChannelShiftControls v-if="tab === 'channel-shift-nav'" />
        <PixelSortControls v-if="tab === 'pixel-sort-nav'" />
      </section>

      <!-- IMAGE OPTIONS -->
      <section class="drawer__section">
        <h3 class="drawer__section-title">Image</h3>

        <div class="control-group" style="margin-bottom: 12px">
          <label>Upload</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            @change="emit('file-change', $event)"
          />
        </div>

        <!-- Quality slider -->
        <div class="control-row">
          <div class="control-group control-group--slider">
            <label>Quality</label>
            <div class="slider-with-value">
              <input
                type="range"
                :value="sketchData.loadQuality"
                @input="sketchData.loadQuality = Number($event.target.value)"
                :min="qualityMin"
                :max="qualityMax"
              />
              <span class="control-value">{{ sketchData.loadQuality }}</span>
            </div>
          </div>
        </div>

        <!-- Byte constraints (not shown for quantTable or pixel-based modes) -->
        <div v-if="!['quantTable', 'quantTable2', 'channelShift', 'pixelSort'].includes(sketchData.glitchType)" class="control-row">
          <div class="control-group">
            <label>Constrain from %</label>
            <input
              type="number"
              :value="sketchData.limitBytesStart"
              @input="sketchData.limitBytesStart = Number($event.target.value)"
              min="0"
              max="99"
            />
          </div>
          <div class="control-group">
            <label>To %</label>
            <input
              type="number"
              :value="sketchData.limitBytesEnd"
              @input="sketchData.limitBytesEnd = Number($event.target.value)"
              min="1"
              max="100"
            />
          </div>
        </div>
      </section>

      <!-- BLEND OPTIONS (hidden for pixel sort) -->
      <section v-if="!['pixelSort'].includes(sketchData.glitchType)" class="drawer__section">
        <h3 class="drawer__section-title">Blend</h3>

        <label class="toggle" style="margin-bottom: 12px">
          <input
            type="checkbox"
            :checked="sketchData.blended"
            @change="sketchData.blended = $event.target.checked"
          />
          <span class="toggle__track"></span>
          <span class="toggle__label">Blend with original</span>
        </label>

        <div class="blend-modes">
          <button
            v-for="mode in blendModes"
            :key="mode"
            class="blend-pill"
            :class="{ 'blend-pill--active': sketchData.blendMode === mode }"
            @click="sketchData.blendMode = mode; sketchData.blended = true"
          >
            {{ mode }}
          </button>
        </div>
      </section>

      <!-- SAVE ACTION -->
      <section class="drawer__section drawer__section--action">
        <button class="btn btn--accent btn--full" @click="emit('save')">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"/>
          </svg>
          Save Full Size
        </button>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted, onBeforeUnmount } from 'vue'
import { useDrawerDrag } from '@/composables/useDrawerDrag'
import HexReplaceControls from '@/components/controls/HexReplaceControls.vue'
import RandomBytesControls from '@/components/controls/RandomBytesControls.vue'
import QuantTableControls from '@/components/controls/QuantTableControls.vue'
import ChannelShiftControls from '@/components/controls/ChannelShiftControls.vue'
import PixelSortControls from '@/components/controls/PixelSortControls.vue'

const sketchData = inject('sketchData')
const tab = inject('tab')

const emit = defineEmits(['mode-change', 'file-change', 'save'])

const drawerEl = ref(null)

const {
  isExpanded, isDragging, drawerStyle,
  toggleDrawer, collapse,
  onTouchStart, onTouchMove, onTouchEnd, onMouseDown,
} = useDrawerDrag()

const blendModes = ['DARKEST', 'LIGHTEST', 'DIFFERENCE', 'MULTIPLY', 'EXCLUSION', 'SCREEN']

const modes = [
  { id: 'crush',         icon: '///',  name: 'Crush',         desc: 'JPG byte swap',    tab: 'hex-replace-nav',    type: 'hexReplace',  ext: 'jpg' },
  { id: 'gentle-crush',  icon: '~~~',  name: 'Gentle Crush',  desc: 'JPG random bytes', tab: 'random-replace-nav', type: 'randomBytes', ext: 'jpg' },
  { id: 'crumble',       icon: '###',  name: 'Crumble',       desc: 'WebP byte swap',   tab: 'hex-replace-nav',    type: 'hexReplace',  ext: 'webp' },
  { id: 'chaos-crumble', icon: '***',  name: 'Chaos Crumble', desc: 'WebP random',      tab: 'random-replace-nav', type: 'randomBytes', ext: 'webp' },
  { id: 'smoosh',        icon: '%%%',  name: 'Smoosh',        desc: 'Quant table',      tab: 'quant-table-nav',    type: 'quantTable',  ext: 'jpg' },
  { id: 'dark-smoosh',   icon: '@@@',  name: 'Dark Smoosh',   desc: 'Dark quant table', tab: 'quant-table-nav',    type: 'quantTable2', ext: 'jpg' },
  { id: 'grind',         icon: '<>>',  name: 'Grind',         desc: 'JPG byte swap',    tab: 'hex-replace-nav',    type: 'byteSwap',    ext: 'jpg' },
  { id: 'fracture',      icon: '<<>',  name: 'Fracture',      desc: 'Channel shift',    tab: 'channel-shift-nav',  type: 'channelShift', ext: 'jpg' },
  { id: 'sift',          icon: '=|=',  name: 'Sift',          desc: 'Pixel sort',       tab: 'pixel-sort-nav',     type: 'pixelSort',   ext: 'jpg' },
]

const currentModeName = computed(() => {
  const mode = modes.find(m => m.type === sketchData.glitchType && m.ext === sketchData.glitchExtType)
  return mode ? mode.name : 'Crush'
})

const qualityMin = computed(() => {
  return ['quantTable', 'quantTable2'].includes(sketchData.glitchType) ? 96 : 0
})

const qualityMax = computed(() => {
  return sketchData.glitchExtType === 'webp' ? 99 : 100
})

function isActiveMode(mode) {
  return mode.type === sketchData.glitchType && mode.ext === sketchData.glitchExtType
}

function selectMode(mode) {
  emit('mode-change', { tab: mode.tab, type: mode.type, ext: mode.ext })
}

function onClickOutside(e) {
  if (isExpanded.value && drawerEl.value && !drawerEl.value.contains(e.target)) {
    collapse()
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))
</script>

<style scoped>
.drawer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: var(--bg-surface);
  border-radius: var(--drawer-radius);
  box-shadow: 0 -4px 40px rgba(0, 0, 0, 0.6);
  overflow: hidden;
  transition: height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.drawer--dragging {
  transition: none;
}

.drawer--expanded {
  overflow-y: auto;
}

.drawer__header {
  cursor: grab;
  user-select: none;
}

.drawer__header:active {
  cursor: grabbing;
}

.drawer__handle {
  display: flex;
  justify-content: center;
  padding: 14px 0 8px;
}

.drawer__handle-bar {
  width: 44px;
  height: 5px;
  border-radius: 3px;
  background: var(--text-muted);
  transition: background var(--transition-fast);
}

.drawer__summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 20px 14px;
  cursor: pointer;
}

.drawer__mode-badge {
  background: rgba(226, 52, 171, 0.12);
  color: var(--accent);
  padding: 6px 18px;
  border-radius: 20px;
  font-family: var(--font-brand);
  font-size: 14px;
  font-weight: 700;
  border: 1px solid rgba(226, 52, 171, 0.2);
}

.drawer__quick-actions {
  display: flex;
  gap: 8px;
}

.drawer__icon-btn {
  padding: 6px 10px;
  color: var(--text-secondary);
}

.drawer__icon-btn:hover {
  color: var(--accent);
}

.drawer__content {
  padding: 4px 20px 32px;
}

.drawer__section {
  margin-bottom: 20px;
}

.drawer__section-title {
  font-family: var(--font-brand);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--text-muted);
  margin-bottom: 10px;
}

.drawer__section--action {
  margin-bottom: 0;
}

/* Mode Selector Grid */
.mode-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

@media (max-width: 420px) {
  .mode-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.mode-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 6px 8px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--bg-elevated);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--font-body);
}

.mode-chip:hover {
  border-color: rgba(226, 52, 171, 0.3);
  background: rgba(226, 52, 171, 0.06);
}

.mode-chip--active {
  border-color: var(--accent);
  background: rgba(226, 52, 171, 0.1);
  color: var(--text-primary);
  box-shadow: 0 0 20px rgba(226, 52, 171, 0.15);
}

.mode-chip__icon {
  font-family: var(--font-mono);
  font-size: 14px;
  margin-bottom: 2px;
  color: var(--accent);
}

.mode-chip__name {
  font-size: 12px;
  font-weight: 600;
}

.mode-chip__desc {
  font-size: 10px;
  color: var(--text-muted);
  margin-top: 1px;
}

/* Controls */
.control-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 10px;
}

.control-group {
  flex: 1;
}

.control-group label {
  display: block;
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.control-group--slider {
  flex: 1;
}

.slider-with-value {
  display: flex;
  align-items: center;
  gap: 12px;
}

.slider-with-value input[type="range"] {
  flex: 1;
}

.control-value {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--accent);
  min-width: 36px;
  text-align: right;
}

/* Toggle label */
.toggle__label {
  font-size: 13px;
  color: var(--text-secondary);
}

/* Blend mode pills */
.blend-modes {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.blend-pill {
  padding: 5px 12px;
  border-radius: 20px;
  border: 1px solid var(--border);
  background: var(--bg-elevated);
  color: var(--text-secondary);
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.blend-pill:hover {
  border-color: rgba(226, 52, 171, 0.3);
  color: var(--text-primary);
}

.blend-pill--active {
  border-color: var(--accent);
  background: rgba(226, 52, 171, 0.1);
  color: var(--accent);
}

/* Full-width button */
.btn--full {
  width: 100%;
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
}
</style>
