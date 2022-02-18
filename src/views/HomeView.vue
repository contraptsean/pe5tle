
<template>
  <main>
    <h1 class="green">Pe5tle</h1>
    <div>
    <label for="avatar">Ingredients:</label>
    <input type="file"
       id="ingredient" name="ingredient"
       accept="image/png, image/jpeg" @change="onFileChange">
           </div>
           <h3>Hex Replace</h3>

    <label for="findVal">Replace this Byte (0-256):</label>
    <input type="number" id="findVal" v-model="sketchData.byteFindVal" name="findVal"
       min="0" max="256">
       <label for="repValue">with this Byte (0-256):</label>
    <input type="number" id="repValue" v-model="sketchData.byteRepVal" name="repValue"
       min="0" max="256">
    <CanvasMain v-bind="sketchData" />
  </main>
</template>

<script>
import CanvasMain from '@/components/CanvasMain.vue'

export default {
  components: {
    CanvasMain,
  },

   data() {
    return {
      sketchData: {
        byteFindVal: 100,
        byteRepVal: 104,
        imgSrc: require('src/assets/bear.jpg'),
        imgW: 1200,
        imgH: 900,
        sketchParent:'sketch1',
        glitchExtType:'jpg',

      }
      
    }
  },
  methods: {
    //changes the image source into something usable when file input is used 
    onFileChange(e) {
      const file = e.target.files[0];
      let i = new Image();
      this.sketchData.imgSrc = URL.createObjectURL(file);   
      i.src = this.sketchData.imgSrc 
      i.onload = () => {
        this.sketchData.imgW = i.naturalWidth;
        this.sketchData.imgH = i.naturalHeight;
}
    },
  },

}
  
</script>
