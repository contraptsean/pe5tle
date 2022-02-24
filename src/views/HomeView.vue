
<template>
<!----->
<div class="container-fluid">
  <div class="row">

    <div class="col-md-3">

      <!--top nav-->
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Pe5tle</a>
      <div class="image-upload mt-2 border">
      <label for="formFile" class="form-label">New Image <i class="bi bi-plus-circle ms-2"></i></label>
      <input class="form-control" type="file" id="formFile"
      accept="image/png, image/jpeg" @change="onFileChange">
    </div>

<div class="d-lg-none" id="saveWrapper">
    </div>
    

<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavDropdown">

  <ul class="navbar-nav">
        
<!--         
        <li class="nav-item">
          <a class="nav-link" href="#">About</a>
        </li> -->

        <li class="nav-item"
        :class="{'dropdown': !isMobile}">
          <a class="nav-link dropdown-toggle d-none d-lg-block " href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Glitch Modes
          </a>

          <ul class="list-unstyled" :class="{'dropdown-menu': !isMobile}" aria-labelledby="navbarDropdownMenuLink">
            <li><button class="dropdown-item" data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show"
             @click="currentGlitch('hex-replace-nav', 'hexReplace', 'jpg')">Hex JPG</button></li>
            <li><button class="dropdown-item" data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show"
             @click="currentGlitch('random-replace-nav', 'randomBytes', 'jpg')">Random JPG Replace</button></li>
            <li><button class="dropdown-item" data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show"
             @click="currentGlitch('hex-replace-nav', 'hexReplace', 'webp')">Hex WEBP</button></li>
            <li><button class="dropdown-item" data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show"
             @click="currentGlitch('random-replace-nav', 'randomBytes', 'webp')">Ran WEBP Replace</button></li>

            <li><button class="dropdown-item" data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show"
             @click="currentGlitch('quant-table-nav', 'quantTable', 'jpg')">QuantTable JPG</button></li>

            <li><router-link class="dropdown-item" to="/about">About this</router-link></li>
          </ul>
        </li>

      </ul>



    </div>
    
  </div><!--nav container-->
</nav>
<div :class="{'fixed-bottom' : isMobile}">
<nav class="navbar navbar-light">
  <div class="container-fluid">


<ul class="navbar-nav">
<form>
  <li class="nav-item d-flex flex-row align-items-center justify-content-start" v-if="(tab === 'hex-replace-nav')">
    <label class="form-label" for="findVal">Replace</label>
    <input class="form-control form-control-sm" type="number" id="findVal" v-model="sketchData.byteFindVal" name="findVal"
       min="0" max="255">
    
    <label for="repValue">with</label>
    <input class="form-control form-control-sm" type="number" id="repValue" v-model="sketchData.byteRepVal" name="repValue"
       min="0" max="255">
       (0-255)

  </li>


  <li class="nav-item d-flex align-items-center justify-content-start" v-if="(tab === 'random-replace-nav')">
    <label for="numRandomBytes">Replace this many bytes Byte (0-500):</label>
    <input type="number" id="numRandomBytes" v-model="sketchData.numRandomBytes" name="numRandomBytes"
       min="0" max="500">
  </li>

  <li v-if="(sketchData.glitchType !== 'quantTable')" class="nav-item d-flex align-items-center justify-content-start">

    <label class="form-label" for="limitBytesStart">Constrain From</label>
    <input class="form-control form-control-sm" type="number" id="limitBytes" v-model="sketchData.limitBytesStart" name="limitBytesStart"
       min="0" max="99">
    
    <label class="form-label" for="limitBytesEnd">To</label>
    <input class="form-control form-control-sm" type="number" id="limitBytesEnd" v-model="sketchData.limitBytesEnd" name="limitBytesEnd"
       min="1" max="100">

  </li>


<!---quality blocks-->
  
  <li v-if="(sketchData.glitchExtType == 'jpg') && (sketchData.glitchType !== 'quantTable')" class="nav-item d-flex align-items-center justify-content-start">
    <label class="form-label" for="loadQuality">Quality</label>
    <input type="range" id="loadQuality" v-model="sketchData.loadQuality" name="loadQuality"
       min="0" max="100">
  </li>

  <li v-else-if="(sketchData.glitchExtType == 'webp')" class="nav-item d-flex align-items-center justify-content-start">
    <label class="form-label" for="loadQuality">Quality</label>
    <input type="range" id="loadQuality" v-model="sketchData.loadQuality" name="loadQuality"
       min="0" max="99">
  </li>

  <li v-else-if="(sketchData.glitchType == 'quantTable')" class="nav-item d-flex align-items-center justify-content-start">
    <label class="form-label" for="loadQuality">Quality</label>
    <input type="range" id="loadQuality" v-model="sketchData.loadQuality" name="loadQuality"
       min="96" max="100">
  </li>

  <!---blend options-->
<li class="nav-item">
  <div class="row">
    <div class="col">


<div class="form-check form-switch">
  <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" v-model="sketchData.blended">
  <label class="form-check-label" for="flexSwitchCheckDefault">Blend Result</label>
</div>
    </div>
    <div class="col">


<select class="form-select form-select-sm" aria-label=".form-select-sm example" v-model="sketchData.blendMode">
  <option v-for="blendMode in blendModes" :value="blendMode" :key="blendMode.id">{{blendMode}}</option>
</select>
  </div>
    </div>

</li>

</form>
</ul>
  </div><!--end bottom contain-->
</nav><!--end bottom nav-->
      </div><!--end fixed bottom wrapper-->  



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
        loadQuality: "100",
        imgSrc: imgUrl,
        sketchParent:'glitchCanvas',
        glitchType:'hexReplace',      
        glitchExtType:'jpg',
        windowWidth:ref(window.innerWidth),
        blended:false,
        blendMode:'DARKEST',
      },
      tab:'hex-replace-nav',
      blendModes: ['DARKEST', 'LIGHTEST', 'DIFFERENCE', 'MULTIPLY', 'EXCLUSION', 'SCREEN'],
      
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
    currentGlitch(tab, type, ext) {
      this.tab = tab;
      this.sketchData.glitchType = type;
      this.sketchData.glitchExtType = ext;
      if (ext == 'webp') {
        this.sketchData.loadQuality = "99";
      }
      if (ext == 'jpg')
        this.sketchData.loadQuality = "100";
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
