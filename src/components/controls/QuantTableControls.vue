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
          :value="sketchData.quantTableByte"
          @input="sketchData.quantTableByte = Number($event.target.value)"
          min="10"
          max="255"
        />
        <span class="control-value">{{ sketchData.quantTableByte }}</span>
      </div>
    </div>
  </div>
</template>
