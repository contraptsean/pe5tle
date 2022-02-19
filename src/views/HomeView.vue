
<template>
<!----->
<div class="container-fluid">
  <div class="d-flex  flex-row">

<ul class="nav flex-column flex-fill justify-content-start">

  <h1 class="display-3 text-success border-bottom">Pe5tle</h1>

  <li class="nav-item">
    <label for="ingredient"><h2 class="h4">Ingredients</h2></label>
    <input type="file"
       id="ingredient" name="ingredient"
       accept="image/png, image/jpeg" @change="onFileChange">
  </li>

  <li class="nav-item">
    <h2 class="h4">Hex Replace</h2>

    <label for="findVal">Replace this Byte (0-256):</label>
    <input type="number" id="findVal" v-model="sketchData.byteFindVal" name="findVal"
       min="0" max="256" @change="sketchData.glitchType='hexReplace'">
    
    <label for="repValue">with this Byte (0-256):</label>
    <input type="number" id="repValue" v-model="sketchData.byteRepVal" name="repValue"
       min="0" max="256" @change="sketchData.glitchType='hexReplace'">

  </li>


  <li class="nav-item">
     <h2 class="h4">Random Replace</h2>

    <label for="numRandomBytes">Replace this many bytes Byte (0-500):</label>
    <input type="number" id="numRandomBytes" v-model="sketchData.numRandomBytes" name="numRandomBytes"
       min="0" max="500" @change="sketchData.glitchType='randomBytes'">
  </li>

  <li class="nav-item">
    <h2 class="h4">Constrain Smashing</h2>

    <label for="limitBytesStart">Limit Start at (percent of file):</label>
    <input type="number" id="limitBytes" v-model="sketchData.limitBytesStart" name="limitBytesStart"
       min="0" max="100">
    
    <label for="limitBytesEnd">Limit End at (percent of file):</label>
    <input type="number" id="limitBytesEnd" v-model="sketchData.limitBytesEnd" name="limitBytesEnd"
       min="0" max="256">

  </li>

  
  <li class="nav-item">
     <h2 class="h4">Glitch Type</h2>

<div class="form-check">
  <input class="form-check-input" v-model="sketchData.glitchExtType" :value="'jpg'" type="radio" name="jpegRadio" id="jpegRadio">
  <label class="form-check-label" for="jpegRadio">
    JPG
  </label>
</div>
<div class="form-check">
  <input class="form-check-input" v-model="sketchData.glitchExtType" :value="'webp'" type="radio" name="webpRadio" id="webpRadio">
  <label class="form-check-label" for="webpRadio">
    WEBP
  </label>
</div>

  </li>




</ul>




      
  <main class="flex-fill">
    <CanvasMain v-bind="sketchData" />
  </main>

    </div><!--end row-->
</div>



       
       <!----->

</template>

<script>
import CanvasMain from '@/components/CanvasMain.vue'
import imgUrl from '../assets/bear.jpg'

export default {
  components: {
    CanvasMain,
  },

   data() {
    return {
      sketchData: {
        byteFindVal: 100,
        byteRepVal: 104,
        numRandomBytes: 10,
        limitBytesStart: 20,
        limitBytesEnd:100,
        imgSrc: imgUrl,
        imgW: 1200,
        imgH: 900,
        sketchParent:'sketch1',
        glitchExtType:'jpg',
        glitchType:'hexReplace',

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
        this.sketchData.imgW = i.width;
        this.sketchData.imgH = i.height;
}
    },
  },

}
  
</script>

<style scoped>
#app .nav-item {
  margin: 1rem .5rem;
}
</style>
