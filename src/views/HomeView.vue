
<template>
<!----->
<div class="container-fluid">
  <div class="row">
    <div class="col-md-3">

      <!--top nav-->
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Pe5tle</a>
      <div class="image-upload mt-2">
      <label for="formFile" class="form-label">New Image <i class="bi bi-plus-circle ms-2"></i></label>
      <input class="form-control" type="file" id="formFile"
      accept="image/png, image/jpeg" @change="onFileChange">
    </div>

    <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offCanvasNav" aria-controls="offCanvasNav" aria-expanded="false" aria-label="Toggle navigation">
       (Icon?)
    </button>

<div class="offcanvas offcanvas-start" tabindex="-1" id="offCanvasNav" aria-labelledby="offcanvasExampleLabel">      <ul class="navbar-nav">

  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="offcanvasExampleLabel">Offcanvas Title</h5>
    <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
        
<!--         
        <li class="nav-item">
          <a class="nav-link" href="#">About</a>
        </li> -->

        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Gltich Drop
          </a>

          <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
            <li><a class="dropdown-item" @click="currentTab('hex-replace-nav')">Hex Button</a></li>
            <li><a class="dropdown-item" @click="currentTab('random-replace-nav')">Ran Rep</a></li>
            <li><a class="dropdown-item" href="#">Something else here</a></li>
          </ul>
        </li>

      </ul>

    </div><!--offcanvas nav-->



  </div><!--nav container-->
</nav>
      
<nav class="navbar fixed-bottom navbar-light bg-light">
  <div class="container-fluid">


<ul class="navbar-nav">

  <li class="nav-item" v-if="(tab === 'hex-replace-nav') || !isMobile">
    <label for="findVal">Replace</label>
    <input type="number" id="findVal" v-model="sketchData.byteFindVal" name="findVal"
       min="0" max="255" @change="sketchData.glitchType='hexReplace'">
    
    <label for="repValue">with</label>
    <input type="number" id="repValue" v-model="sketchData.byteRepVal" name="repValue"
       min="0" max="255" @change="sketchData.glitchType='hexReplace'">
       (0-255)

  </li>


  <li class="nav-item" v-if="(tab === 'random-replace-nav') || !isMobile">
     <p class="nav-heading">Random Replace</p>

    <label for="numRandomBytes">Replace this many bytes Byte (0-500):</label>
    <input type="number" id="numRandomBytes" v-model="sketchData.numRandomBytes" name="numRandomBytes"
       min="0" max="500" @change="sketchData.glitchType='randomBytes'">
  </li>

  <li class="nav-item">

    <label for="limitBytesStart">Constrain From</label>
    <input type="number" id="limitBytes" v-model="sketchData.limitBytesStart" name="limitBytesStart"
       min="0" max="99">
    
    <label for="limitBytesEnd">To</label>
    <input type="number" id="limitBytesEnd" v-model="sketchData.limitBytesEnd" name="limitBytesEnd"
       min="1" max="100">

  </li>

  
  <!-- <li>
     <h2 class="nav-heading">Glitch Type</h2>

<li class="form-check">
  <input class="form-check-input" v-model="sketchData.glitchExtType" :value="'jpg'" type="radio" name="jpegRadio" id="jpegRadio">
  <label class="form-check-label" for="jpegRadio">
    JPG
  </label>
</li>

<li class="form-check">
  <input class="form-check-input" v-model="sketchData.glitchExtType" :value="'webp'" type="radio" name="webpRadio" id="webpRadio">
  <label class="form-check-label" for="webpRadio">
    WEBP
  </label>
</li>

  </li> -->

  
  <li class="nav-item">
    <label for="loadQuality">Quality:</label>
    <input type="number" id="loadQuality" v-model="sketchData.loadQuality" name="loadQuality"
       min="0" max="100">
  </li>
</ul>
  </div><!--end bottom contain-->
</nav><!--end bottom nav-->



</div><!--end col-->
<div class="col-md-9">

<CanvasMain v-bind="sketchData" />
</div>

  </div><!--end ro9w-->
</div><!--end contain-->


</template>

<script>
import {ref} from "vue"
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
        loadQuality: 100,
        imgSrc: imgUrl,
        sketchParent:'glitchCanvas',
        glitchExtType:'jpg',
        glitchType:'hexReplace',
        windowWidth:ref(window.innerWidth),
      },
      
      tab:'hex-replace-nav',
      
    }
  },


  methods: {
    //changes the image source into something usable when file input is used 
    onFileChange(e) {
      const file = e.target.files[0];
      let i = new Image();
      this.sketchData.imgSrc = URL.createObjectURL(file);   
      i.src = this.sketchData.imgSrc 
    },
    currentTab(tab) {
      this.tab = tab;
    },



  },
  mounted() {
  window.addEventListener('resize', () => {
    this.sketchData.windowWidth = window.innerWidth
  })
  },
  beforeUnmount() {
    window.removeEventListener('resize', () => {
      this.sketchData.windowWidth = window.innerWidth
    })
  },

  computed: {
    isMobile() {
      return this.sketchData.windowWidth <= 768;
    },
  },

}
  
</script>

<style scoped>

</style>
