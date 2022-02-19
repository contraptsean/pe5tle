
<template>
<div class="container mt-3">



    <div id="sketch1" class="p5sketch"></div>

</div>

</template>


<script>

export default {

props: {
	byteFindVal: Number,
	byteRepVal: Number,
	numRandomBytes: Number,
	imgSrc: String,
	imgH:Number,
	imgW:Number,
	sketchParent: String,
	glitchExtType: String,
	glitchType: String,
	limitBytesStart: Number,
	limitBytesEnd: Number,
},
data() {
    return { myp5:{} }
  },

  methods: {

  buildSketch(elm, type){
	let parent = document.getElementById(elm);
	let loading = true;
    let src = this.imgSrc;
	let imgW = this.imgW;
	let imgH = this.imgH;
    let byteFindVal = this.byteFindVal;
    let byteRepVal = this.byteRepVal;
    let numRandomBytes = this.numRandomBytes;
	let glitchType = this.glitchType;
	let limitBytesStart = this.limitBytesStart / 100;
	let limitBytesEnd = this.limitBytesEnd / 100;

		
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

			}

		sketch.draw = () => {
		  //console.log(sketch.glitch);
			sketch.image(sketch.glitch.image, sketch.width/2, sketch.height/2);

			}

       sketch.glitched = function() {
		   sketch.glitch.limitBytes(limitBytesStart, limitBytesEnd);

		   switch (glitchType) {
			   case 'hexReplace' :
				   	sketch.glitch.resetBytes();
					sketch.glitch.replaceBytes(byteFindVal, byteRepVal); // swap all decimal byte 100 for 104
					sketch.glitch.buildImage();
					break;

				case 'randomBytes' :
				   	sketch.glitch.resetBytes();
					sketch.glitch.randomBytes(numRandomBytes); // set random bytes, throughout data
					sketch.glitch.buildImage();
					break;

		   }
		
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

</style>
