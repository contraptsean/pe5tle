
<template>


    <div id="sketch1" class="p5sketch"></div>


</template>


<script>

export default {

props: {
	byteFindVal: Number,
	byteRepVal: Number,
	imgSrc: String,
	imgH:Number,
	imgW:Number,
	sketchParent: String,
	glitchExtType: String
},
data() {
    return { myp5:{} }
  },

  methods: {

  buildSketch(elm, type){
	let parent = document.getElementById(elm);
    let src = this.imgSrc;
	let imgW = this.imgW;
	let imgH = this.imgH;
    let byteFindVal = this.byteFindVal;
    let byteRepVal = this.byteRepVal;
	
		this.myp5 = new p5( function(sketch){
			sketch.glitch;

			sketch.setup = () => {

			sketch.createCanvas(imgW, imgH);
	      	sketch.background(0);
	      	sketch.imageMode(sketch.CENTER);
				sketch.glitch = new Glitch(sketch);
				sketch.glitch.loadType(type);
				sketch.glitch.loadQuality(1.0);
				sketch.glitch.loadImage(src, function(){
					sketch.glitched();
				});
				sketch.glitch.errors(false);
				sketch.disableFriendlyErrors = true;

			};

		sketch.draw = () => {
	      sketch.image(sketch.glitch.image, sketch.width/2, sketch.height/2)

			}

       sketch.glitched = function() {
			sketch.glitch.resetBytes();
        	sketch.glitch.replaceBytes(byteFindVal, byteRepVal); // swap all decimal byte 100 for 104
        	sketch.glitch.buildImage();
		}


      }, parent);
        
    },
  },

  mounted() {
  this.buildSketch(this.sketchParent, this.glitchExtType);
  },

  watch: {
    $props: {
      handler(newValue, oldValue) {
		this.myp5.remove();
		this.buildSketch(this.sketchParent, this.glitchExtType);

	},
      deep: true
    }
  }

}

</script>



<style scoped>
		body{
			margin:0;
			overflow:hidden;
		}

/* canvas{
			position:fixed;
			top:0;
			left:0;
			z-index:-1;
			width:100vw;
			height:100vh;
			margin:0;
		} */

</style>
