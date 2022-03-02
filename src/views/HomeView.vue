
<template>
  <!----->
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-3">
        <!--top nav-->
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
          <div class="container-fluid">
            <a class="navbar-brand" href="#">Pe5tle</a>

            <!-- image change button -->
            
            
              <!-- Mobile Save Button -->
            <div class="d-lg-none saveWrapper" id="saveWrapperMobile"></div>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation" >
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavDropdown">
              <ul class="navbar-nav ms-auto">

                <li class="nav-item" :class="{ dropdown: !isMobile }">
                  <a class="nav-link dropdown-toggle d-none d-lg-block" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false" >
                    Glitch Modes
                  </a>

                  <ul class="list-unstyled" :class="{ 'dropdown-menu': !isMobile }" aria-labelledby="navbarDropdownMenuLink" >
                    <li>
                      <button class="dropdown-item" data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show" 
                      @click=" currentGlitch('hex-replace-nav', 'hexReplace', 'jpg') " >
                        Crush
                      </button>
                    </li>
                    <li>
                      <button class="dropdown-item" data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show" 
                      @click=" currentGlitch( 'random-replace-nav', 'randomBytes', 'jpg' ) " >
                        Gentle Crush
                      </button>
                    </li>
                    <li>
                      <button class="dropdown-item" data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show" 
                      @click=" currentGlitch('hex-replace-nav', 'hexReplace', 'webp') " >
                        Crumble
                      </button>
                    </li>
                    <li>
                      <button class="dropdown-item" data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show" 
                      @click=" currentGlitch( 'random-replace-nav', 'randomBytes', 'webp' ) " >
                        Chaos Crumble
                      </button>
                    </li>

                    <li>
                      <button class="dropdown-item" data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show" 
                      @click=" currentGlitch('quant-table-nav', 'quantTable', 'jpg') "> Smoosh </button>
                    </li>

                    <li>
                      <button class="dropdown-item" data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show" 
                      @click=" currentGlitch('quant-table-nav', 'quantTable2', 'jpg') "> Dark Smoosh </button>
                    </li>

                    <li>
                      <router-link class="dropdown-item" to="/about">
                      About this
                      </router-link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
          <!--nav container-->
        </nav>
        <div :class="{ 'fixed-bottom': isMobile }">
          <nav class="navbar navbar-dark pt-0">
            <div class="container-fluid d-block">
              <ul class="navbar-nav">
                <form>
                  <div class="row row-cols-lg-auto">

                  <!-- <button class="image-upload btn btn-outline-info"> -->
                    <div class="col-1 col-lg-12">

                    <label for="formFile" class="form-label h4">
                      <!-- <i class="bi bi-plus-circle"></i> -->
                      <span class="d-none d-lg-block">Upload Image</span>
                      <i class="bi bi-card-image d-lg-none h3"></i>
                    </label>
                    </div>
                    <div class="col-11 col-lg-12">

              <input class="form-control mb-lg-3" type="file" id="formFile" accept="image/png, image/jpeg" @change="onFileChange" />
            <!-- </button> -->
                    </div>
                  </div>

                  <!-- Headings -->

                  <div v-if="tab === 'hex-replace-nav' && sketchData.glitchExtType == 'jpg'">
                    <h2 class="d-none d-lg-block">Crush</h2>
                  </div>

                  <div v-if="tab === 'random-replace-nav' && sketchData.glitchExtType == 'jpg'">
                    <h2 class="d-none d-lg-block">Gentle Crush</h2>
                  </div>

                  <div v-if="tab === 'hex-replace-nav' && sketchData.glitchExtType == 'webp'">
                    <h2 class="d-none d-lg-block">Crumble</h2>
                  </div>

                  <div v-if="tab === 'random-replace-nav' && sketchData.glitchExtType == 'webp'">
                    <h2 class="d-none d-lg-block">Chaos Crumble</h2>
                  </div>

                  <div v-if="tab === 'quant-table-nav'">
                    <h2 class="d-none d-lg-block">Smoosh</h2>
                  </div>

                  <!-- Functions -->

                  <!-- replace byte for targeted hex replace functions input -->
                  <li class="nav-item d-flex align-items-center justify-content-start" v-if="tab === 'hex-replace-nav'">
                    <label class="form-label" for="findVal">Replace</label>
                    <input
                      class="form-control form-control-sm"
                      type="number"
                      id="findVal"
                      v-model="sketchData.byteFindVal"
                      name="findVal"
                      min="0"
                      max="255"
                    />

                    <label for="repValue">with</label>
                    <input
                      class="form-control form-control-sm"
                      type="number"
                      id="repValue"
                      v-model="sketchData.byteRepVal"
                      name="repValue"
                      min="0"
                      max="255"
                    />
                  <p class="flex-grow-1">(0-255)</p>
                  </li>

                
                  <li class="nav-item d-flex align-items-center justify-content-start " v-if="tab === 'random-replace-nav' && sketchData.glitchExtType == 'jpg'" >
                    <label for="numRandomBytes" >Intensity:</label >
                    <input
                      type="range"
                      id="numRandomBytes"
                      v-model.number="sketchData.numRandomBytes"
                      name="numRandomBytes"
                      min="1"
                      max="500"
                    />
                  </li>

                  <li class="nav-item d-flex align-items-center justify-content-start " v-if="tab === 'random-replace-nav' && sketchData.glitchExtType == 'webp'" >
                    <label for="numRandomBytes" >Intensity:</label >
                    <input
                      type="range"
                      id="numRandomBytes"
                      v-model.number="sketchData.numRandomBytes"
                      name="numRandomBytes"
                      min="1"
                      max="100"
                    />
                  </li>

                  <!-- Intensity Slider for quant table string changes -->
                  <li class="nav-item d-flex align-items-center justify-content-start " v-if="tab === 'quant-table-nav' ">
                    <label for="quant-table-byte" >StringByte:</label >
                    <input
                      type="range"
                      v-model.number="sketchData.quantTableByte"
                      id="quant-table-string-byte"
                      name="quant-table-string-byte"
                      min="0"
                      max="255"
                    />
                  </li>

                  <!-- Image Options -->
                  <h2 class="d-none d-lg-block">Image Options</h2>

                  <li v-if="sketchData.glitchType !== 'quantTable'" class=" nav-item d-flex align-items-center">

                  <div class="row g-0">
                    <div class="col-6">
                      <label class="form-label" for="limitBytesStart" >Constrain From</label>
                    </div>
                    <div class="col-2">
                       <input
                      class="form-control form-control-sm"
                      type="number"
                      id="limitBytes"
                      v-model="sketchData.limitBytesStart"
                      name="limitBytesStart"
                      min="0"
                      max="99"
                    />
                      
                    </div>
                    <div class="col-1">
                       <label class="form-label" for="limitBytesEnd">To</label>
                    </div>
                    <div class="col-3">
                       <input
                      class="form-control form-control-sm"
                      type="number"
                      id="limitBytesEnd"
                      v-model="sketchData.limitBytesEnd"
                      name="limitBytesEnd"
                      min="1"
                      max="100"
                    />
                      
                    </div>

                    
                   

                   
                   
                  </div>
                  </li>

                  <!---quality blocks-->

                  <li v-if=" sketchData.glitchExtType == 'jpg' && sketchData.glitchType !== 'quantTable' " class=" nav-item d-flex align-items-center justify-content-start " >
                    <label class="form-label" for="loadQuality">Quality</label>
                    <input
                      type="range"
                      id="loadQuality"
                      v-model.number="sketchData.loadQuality"
                      name="loadQuality"
                      min="0"
                      max="100"
                    />
                  </li>

                  <li v-else-if="sketchData.glitchExtType == 'webp'" class=" nav-item d-flex align-items-center justify-content-start " >
                    <label class="form-label" for="loadQuality">Quality</label>
                    <input
                      type="range"
                      id="loadQuality"
                      v-model.number="sketchData.loadQuality"
                      name="loadQuality"
                      min="0"
                      max="99"
                    />
                  </li>

                  <li v-else-if="sketchData.glitchType == 'quantTable'" class=" nav-item d-flex align-items-center justify-content-start " >
                    <label class="form-label" for="loadQuality">Quality</label>
                    <input
                      type="range"
                      id="loadQuality"
                      v-model.number="sketchData.loadQuality"
                      name="loadQuality"
                      min="96"
                      max="100"
                    />
                  </li>
                  <!-- Blend Options -->
                  <h2 class="d-none d-lg-block mt-lg-2">Blend</h2>

                  <li class="">
                    
                      
                        <div class="form-check form-switch">
                          <label class="form-check-label" for="flexSwitchCheckDefault" >Blend With Original Image</label>
                          <input
                            class="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="flexSwitchCheckDefault"
                            v-model="sketchData.blended"
                          />
                        </div>
                        <div class="row g-0 mt-2">
                          <div class="col-5">
                            <label for="blend-mode" class="form-label">Blend Mode:</label>

                          </div>

                          <div class="col-7">
                               
                        <select class="form-select form-select-sm" aria-label="blend-mode" 
                        v-model="sketchData.blendMode" 
                        @change="sketchData.blended = true">
                          <option v-for="blendMode in blendModes" 
                          :value="blendMode" 
                          :key="blendMode.id"
                          >
                            {{ blendMode }}
                          </option>
                        </select>

                          </div>
                       

                        </div>
                     
                        
                      
                  </li>

                  <div class="d-none d-lg-block saveWrapper" id="saveWrapperDesktop" ></div>
                </form>
              </ul>
            </div>      <!--end bottom contain-->
          </nav>    <!--end bottom nav-->
        </div>  <!--end fixed bottom wrapper-->
      </div><!--end col-->

      <div class="col-lg-9">
        <CanvasMain v-bind="sketchData" />
      </div>

    </div>  <!--end ro9w-->
  </div><!--end contain-->
</template>

<script>
import { ref } from "vue";
import CanvasMain from "@/components/CanvasMain.vue";
import imgUrl from "../assets/bear.jpg";

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
        quantTableByte:10,
        limitBytesStart: 20,
        limitBytesEnd: 100,
        loadQuality: 100,
        imgSrc: imgUrl,
        imgW: 1200,
        imgH: 900,
        sketchParent: "glitchCanvas",
        glitchType: "hexReplace",
        glitchExtType: "jpg",
        windowWidth: ref(window.innerWidth),
        blended: false,
        blendMode: "DARKEST",
      },
      tab: "hex-replace-nav",
      blendModes: [
        "DARKEST",
        "LIGHTEST",
        "DIFFERENCE",
        "MULTIPLY",
        "EXCLUSION",
        "SCREEN",
      ],
    };
  },

  methods: {
    //changes the image source into something usable when file input is used
    onFileChange(e) {
      const file = e.target.files[0];
      let i = new Image();
      this.sketchData.imgSrc = URL.createObjectURL(file);
      i.src = this.sketchData.imgSrc;
      i.onload = () => {
        this.sketchData.imgW = i.naturalWidth;
        this.sketchData.imgH = i.naturalHeight;
      };
    },
    //setting up controls and values when a glitch function is chosen
    currentGlitch(tab, type, ext) {
      this.tab = tab;
      this.sketchData.glitchType = type;
      this.sketchData.glitchExtType = ext;
      this.sketchData.blended = false;
      if (ext == "webp") {
        this.sketchData.loadQuality = 99;
      }
      if (ext == "jpg") this.sketchData.loadQuality = 100;
    },
  },
  //resize event listeners loaded and unloaded to force a reload and resizing of the sketch when a window is resized
  mounted() {
    window.addEventListener("resize", () => {
      this.sketchData.windowWidth = window.innerWidth;
    });
  },
  beforeUnmount() {
    window.removeEventListener("resize", () => {
      this.sketchData.windowWidth = window.innerWidth;
    });
  },
    //mobile computed value to make a few things more readable
  computed: {
    isMobile() {
      return this.sketchData.windowWidth <= 992;
    },
  },
};
</script>
