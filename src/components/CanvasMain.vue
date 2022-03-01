<template>
  <div ref="sketchWrapper">
    <main class="main" id="main">
      <div id="p5_loading" class="loadingclass">
        <div class="spinner-border p-5 m-5" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div id="glitchCanvas" class="p5sketch pt-1"></div>
    </main>
  </div>

  <!-- mobile save button -->
  <Teleport v-if="isMounted" to="#saveWrapperMobile">
    <button type="button" class="btn btn-secondary" @click="saveImage">
      Save
      <i class="bi bi-save ms-1"></i>
    </button>
  </Teleport>

  <!-- desktop save button -->
  <Teleport v-if="isMounted" to="#saveWrapperDesktop">
    <button type="button" class="btn btn-secondary mt-3" @click="saveImage">
      Save Full Size
      <i class="bi bi-save ms-2"></i>
    </button>
  </Teleport>
</template>


<script>
//p5 import
import p5 from "p5";

export default {
  props: {
    byteFindVal: Number,
    byteRepVal: Number,
    numRandomBytes: Number,
    quantTableByte: String,
    loadQuality: Number,
    imgSrc: String,
    imgW: Number,
    imgH: Number,
    sketchParent: String,
    glitchExtType: String,
    glitchType: String,
    limitBytesStart: Number,
    limitBytesEnd: Number,
    windowWidth: Number,
    blended: Boolean,
    blendMode: String,
  },

  data() {
    return {
      myp5: {}, //p5 object after sketch is loaded and drawn
      isMounted: false, //mounted boolean to make teleport work and a little more readable
    };
  },

  methods: {
	  //runs the preload, setup, draw and glitch function, and sets it to the parent element provided
    buildSketch(elm, p) {
      let containerWidth = this.$refs.sketchWrapper.clientWidth;
      let containerHeight = window.innerHeight;
      let parent = document.getElementById(elm);
      let limitBytesStart = this.limitBytesStart / 100;
      let limitBytesEnd = this.limitBytesEnd / 100;
      let loadQuality = this.loadQuality / 100;
      let isMobile = this.isMobile;
      let img0;

      this.myp5 = new p5(function (sketch) {
		  //loads the image and glitches it, so it will be available before the noLoop function is called
		  //It also gives a nice loading message and breaks up the stages to be more understandable
        sketch.preload = () => {
          sketch.glitch = new Glitch(sketch); // new glitch object
          sketch.glitch.loadType(p.glitchExtType);
          sketch.glitch.loadQuality(loadQuality);
          img0 = sketch.loadImage(p.imgSrc); //load a copy of the original image for blending later
          sketch.glitch.loadImage(p.imgSrc, function () { //load the image for glitching
            sketch.glitched(); //callback to glitch an image when its loaded
          });
        };
		  //sets up the canvas for displaying the image
        sketch.setup = () => {
          sketch.createCanvas(containerWidth, containerHeight - 10);
          sketch.pixelDensity(1); //for mobile
           //on mobile devices, start the image right after the navbar (like for longer phone images for instance)
		   //otherwise center the image 
		  if (isMobile) {
            sketch.imageMode(sketch.CORNER);
          } else {
            sketch.imageMode(sketch.CENTER);
          }
          sketch.glitch.errors(false); //I know what I'm doing to the image is wrong
          sketch.disableFriendlyErrors = true; //We're friendly but still..
          sketch.noLoop(); //only draw the image once, rather than continuing to try to animate it
        };
		  //draw the image on the canvas we just setup
        sketch.draw = () => {
			//blend first so we can save thos ebytes to buffer later for saving
			//if we blend (or not) first, we can also save a little computation power not resizing our original image for display
			//there could be a better way for this, but I just couldnt figure out how to turn a string into a constant
          if (p.blended) {
            switch (p.blendMode) {
              case "LIGHTEST":
                sketch.glitch.image.blend( img0, 0, 0, sketch.glitch.image.width, sketch.glitch.image.height, 0, 0, sketch.glitch.image.width, sketch.glitch.image.height, sketch.LIGHTEST );
                break;

              case "DARKEST":
                sketch.glitch.image.blend( img0, 0, 0, sketch.glitch.image.width, sketch.glitch.image.height, 0, 0, sketch.glitch.image.width, sketch.glitch.image.height, sketch.DARKEST );
                break;

              case "DIFFERENCE":
                sketch.glitch.image.blend( img0, 0, 0, sketch.glitch.image.width, sketch.glitch.image.height, 0, 0, sketch.glitch.image.width, sketch.glitch.image.height, sketch.DIFFERENCE );
                break;

              case "MULTIPY":
                sketch.glitch.image.blend( img0, 0, 0, sketch.glitch.image.width, sketch.glitch.image.height, 0, 0, sketch.glitch.image.width, sketch.glitch.image.height, sketch.MULTIPY );
                break;

              case "EXCLUSION":
                sketch.glitch.image.blend( img0, 0, 0, sketch.glitch.image.width, sketch.glitch.image.height, 0, 0, sketch.glitch.image.width, sketch.glitch.image.height, sketch.EXCLUSION );
                break;

              case "SCREEN":
                sketch.glitch.image.blend( img0, 0, 0, sketch.glitch.image.width, sketch.glitch.image.height, 0, 0, sketch.glitch.image.width, sketch.glitch.image.height, sketch.SCREEN );
                break;
            }
          //load the glitched image if blended 
          sketch.glitch.loadImage(sketch.glitch.image);
          }
          
		    //make a copy of the glitched bytes in buffer to reconstitute a full size image before saving
			//otherwise, this gets resized because of Object copying by reference
          sketch.glitch.buffer = sketch.glitch.bytes.slice();
			//resize the images to fit the screen
			//by width for mobile devices, by height for desktop, to try to ensure most pictures fit
          if (isMobile) {
            sketch.glitch.image.resize(containerWidth, 0);
            sketch.image(sketch.glitch.image, 0, 0);
          } else {
            sketch.glitch.image.resize(0, containerHeight);
            sketch.image( sketch.glitch.image, sketch.glitch.image.width / 2, sketch.glitch.image.height / 2 );
          }
        };
		  //THE COOL STUFF
		  //this is the glitch functions, i.e. what we are actually doing to the image
        sketch.glitched = function () {
			//first we constrain destruction to the parameters from the prop we were passed
          sketch.glitch.limitBytes(limitBytesStart, limitBytesEnd);
			//we could combine types, but I think it might be easier on the user and UI to generate mostly discrete types that they can layer or re-pe5tle if they like
          switch (p.glitchType) {
            case "hexReplace":
              sketch.glitch.replaceBytes(p.byteFindVal, p.byteRepVal); // swap all decimal byte (initially 100 for 104)
              sketch.glitch.buildImage();
              break;

            case "randomBytes":
              sketch.glitch.randomBytes(p.numRandomBytes); // set random bytes, throughout data
              sketch.glitch.buildImage();
              break;

             // modify jpg quantization table
           case "quantTable":
              switch (p.quantTableByte) {
                case "1":
                  sketch.glitch.replaceHex('ffdb00430001', 'ffdb004300ff');
                  break;

                case "2":
                  sketch.glitch.replaceHex("ffdb00430101", "ffdb004301ff"); // soo colorful!
                  break;

                  case "3":
                  sketch.glitch.replaceHex("ffdb00430101", "ffdb00430111"); // soo colorful!
                  break;

                  case "4":
                  sketch.glitch.replaceHex("ffdb00430001", "ffdb00430011"); // soo colorful!
                  break;

              }
              
              sketch.glitch.buildImage();
              break
          }
        };
      }, parent);
    },
	//the save function, that gets called when the save button is bonked
    saveImage() {
      this.myp5.glitch.bytes = this.myp5.glitch.buffer.slice(); //copy back our handy buffer
      this.myp5.glitch.buildImage(function (img) { //build image from that buffer
        // custom timestamp for exporting
        let d = new Date();
        d.setTime(d.getTime() - new Date().getTimezoneOffset() * 60 * 1000);
        let ts = d
          .toISOString()
          .replace(/[^0-9]/g, "")
          .slice(0, -3);
        img.save("pe5tle_" + ts); //save rebuilt image in the buildImage callback ^^
      });

    },
  },

  mounted() {
	  //build the bear when it starts
    this.buildSketch(this.sketchParent, this.$props);
    this.isMounted = true; //see when everything is loaded for our Teleported buttons
  },
	// This watcher just removes the old sketch and reruns the build process whenever a prop is changed
  watch: {
    $props: {
      handler(newValue) {
        this.myp5.remove();
        this.buildSketch(this.sketchParent, newValue);
      },
      deep: true,
    },
  },
  //computing a mobile value to make the code more readable
  computed: {
    isMobile() {
      return this.windowWidth <= 768;
    },
  },
};
</script>

