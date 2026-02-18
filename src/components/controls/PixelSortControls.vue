<script setup>
import { inject } from 'vue'

const sketchData = inject('sketchData')
</script>

<template>
  <div class="control-row">
    <div class="control-group control-group--slider">
      <label>Threshold</label>
      <div class="slider-with-value">
        <input
          type="range"
          :value="sketchData.pixelSortThreshold"
          @input="sketchData.pixelSortThreshold = Number($event.target.value)"
          min="0"
          max="255"
        />
        <span class="control-value">{{ sketchData.pixelSortThreshold }}</span>
      </div>
    </div>
  </div>
  <div class="control-row">
    <div class="control-group">
      <label>Direction</label>
      <div class="blend-modes">
        <button
          v-for="dir in ['Horizontal', 'Vertical']"
          :key="dir"
          class="blend-pill"
          :class="{ 'blend-pill--active': sketchData.pixelSortDirection === dir }"
          @click="sketchData.pixelSortDirection = dir"
        >
          {{ dir }}
        </button>
      </div>
    </div>
  </div>
</template>
