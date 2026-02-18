<script setup>
import { inject } from 'vue'

const sketchData = inject('sketchData')
</script>

<template>
  <div class="control-row">
    <div class="control-group">
      <label>Find byte</label>
      <input
        type="number"
        :value="sketchData.byteFindVal"
        @input="sketchData.byteFindVal = Number($event.target.value)"
        min="0"
        max="255"
      />
    </div>
    <div class="control-group">
      <label>Replace with</label>
      <input
        type="number"
        :value="sketchData.byteRepVal"
        @input="sketchData.byteRepVal = Number($event.target.value)"
        min="0"
        max="255"
      />
    </div>
  </div>
</template>
