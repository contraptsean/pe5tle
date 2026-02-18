<script setup>
import { inject } from 'vue'

const sketchData = inject('sketchData')
</script>

<template>
  <div class="control-row">
    <div class="control-group control-group--slider">
      <label>Shift amount</label>
      <div class="slider-with-value">
        <input
          type="range"
          :value="sketchData.channelShiftAmount"
          @input="sketchData.channelShiftAmount = Number($event.target.value)"
          min="-100"
          max="100"
        />
        <span class="control-value">{{ sketchData.channelShiftAmount }}</span>
      </div>
    </div>
  </div>
  <div class="control-row">
    <div class="control-group">
      <label>Channel</label>
      <div class="blend-modes">
        <button
          v-for="ch in ['R', 'G', 'B']"
          :key="ch"
          class="blend-pill"
          :class="{ 'blend-pill--active': sketchData.channelShiftChannel === ch }"
          @click="sketchData.channelShiftChannel = ch"
        >
          {{ ch }}
        </button>
      </div>
    </div>
  </div>
</template>
