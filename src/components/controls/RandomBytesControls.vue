<script setup>
import { inject } from 'vue'

const sketchData = inject('sketchData')
</script>

<template>
  <div class="control-row">
    <div class="control-group control-group--slider">
      <label>Intensity</label>
      <div class="slider-with-value">
        <input
          type="range"
          :value="sketchData.numRandomBytes"
          @input="sketchData.numRandomBytes = Number($event.target.value)"
          min="1"
          :max="sketchData.glitchExtType === 'webp' ? 100 : 500"
        />
        <span class="control-value">{{ sketchData.numRandomBytes }}</span>
      </div>
    </div>
  </div>
</template>
