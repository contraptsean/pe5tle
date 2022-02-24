<template>
<div ref="sketchWrapper">
	<main class="main" id="main">
    	<div id="glitchCanvas" class="p5sketch pt-1"></div>
	</main>
</div>
<Teleport v-if="isMounted" to="#saveWrapper">
	<div @click="saveImage">
	Save
	<i class="bi bi-save"></i>
	</div>
</Teleport>
</template>


<script>
//p5 imports
import p5 from 'p5'

export default {

	props: {
		byteFindVal: Number,
		byteRepVal: Number,
		numRandomBytes: Number,
		loadQuality: String,
		imgSrc: String,
		sketchParent: String,
		glitchExtType: String,
		glitchType: String,
		limitBytesStart: Number,
		limitBytesEnd: Number,
		windowWidth:Number,
		blended:Boolean,
		blendMode:String,
	},

	data() {
		return { 
			myp5:{},
			isMounted: false,
			 }
	},

  	methods: {

	buildSketch(elm, p){
		console.log(this.$refs.sketchWrapper.clientWidth)
		let containerWidth = this.$refs.sketchWrapper.clientWidth;
		let containerHeight = window.innerHeight;
		let parent = document.getElementById(elm);
		let limitBytesStart = this.limitBytesStart / 100;
		let limitBytesEnd = this.limitBytesEnd / 100;
		let loadQuality = this.loadQuality / 100;
		let isMobile = this.isMobile;
		let img0;

			this.myp5 = new p5( function(sketch){
				//sketch.glitch;
				

				sketch.preload = () => {
					sketch.glitch = new Glitch(sketch);
					sketch.glitch.loadType(p.glitchExtType);
					sketch.glitch.loadQuality(loadQuality);
					img0 = sketch.loadImage(p.imgSrc);
					sketch.glitch.loadImage(p.imgSrc, function(){
						sketch.glitched();
					});

				}

				sketch.setup = () => {
					sketch.createCanvas((containerWidth - 10 ), (containerHeight - 10));

					sketch.pixelDensity(1)
					if (isMobile) {
						sketch.imageMode(sketch.CORNER);
						console.log('Cornered');
					} else {
						sketch.imageMode(sketch.CENTER);
												console.log('Centered');

					}
					sketch.glitch.errors(false);
					sketch.disableFriendlyErrors = true;
					sketch.noLoop();
				}

				sketch.draw = () => {
					if (isMobile) {
						sketch.glitch.image.resize(containerWidth, 0);
						img0.resize(containerWidth, 0);
					} else {
						sketch.glitch.image.resize(0, containerHeight);
						img0.resize(0, containerHeight);
					}
					if (p.blended) {
						switch (p.blendMode) {

							case 'LIGHTEST' :
								sketch.glitch.image.blend(img0, 0, 0, sketch.glitch.image.width, sketch.glitch.image.height, 0, 0, sketch.glitch.image.width, sketch.glitch.image.height, sketch.LIGHTEST);
							break;
							
							case 'DARKEST' :
								sketch.glitch.image.blend(img0, 0, 0, sketch.glitch.image.width, sketch.glitch.image.height, 0, 0, sketch.glitch.image.width, sketch.glitch.image.height, sketch.DARKEST);
							break;

							case 'DIFFERENCE' :
								sketch.glitch.image.blend(img0, 0, 0, sketch.glitch.image.width, sketch.glitch.image.height, 0, 0, sketch.glitch.image.width, sketch.glitch.image.height, sketch.DIFFERENCE);
							break;

							case 'MULTIPY' :
								sketch.glitch.image.blend(img0, 0, 0, sketch.glitch.image.width, sketch.glitch.image.height, 0, 0, sketch.glitch.image.width, sketch.glitch.image.height, sketch.MULTIPY);
							break;

							case 'EXCLUSION' :
								sketch.glitch.image.blend(img0, 0, 0, sketch.glitch.image.width, sketch.glitch.image.height, 0, 0, sketch.glitch.image.width, sketch.glitch.image.height, sketch.EXCLUSION);
							break;

							case 'SCREEN' :
								sketch.glitch.image.blend(img0, 0, 0, sketch.glitch.image.width, sketch.glitch.image.height, 0, 0, sketch.glitch.image.width, sketch.glitch.image.height, sketch.SCREEN);
							break;

						}

					}
					if (isMobile) {
						sketch.image(sketch.glitch.image, 0,0);
					} else {
						sketch.image(sketch.glitch.image, sketch.glitch.image.width/2, sketch.glitch.image.height/2);
					}
					
					}

				sketch.glitched = function() {
					sketch.glitch.limitBytes(limitBytesStart, limitBytesEnd);

					switch (p.glitchType) {
						case 'hexReplace' :
							sketch.glitch.resetBytes();
							sketch.glitch.replaceBytes(p.byteFindVal, p.byteRepVal); // swap all decimal byte 100 for 104
							sketch.glitch.buildImage();
							break;

						case 'randomBytes' :
							sketch.glitch.resetBytes();
							sketch.glitch.randomBytes(p.numRandomBytes); // set random bytes, throughout data
							sketch.glitch.buildImage();
							break;

							case 'quantTable' :
							sketch.glitch.resetBytes();
							// modify jpg quantization table 2
							sketch.glitch.replaceHex('ffdb00430101', 'ffdb004301ff'); // soo colorful!
							sketch.glitch.buildImage();
							break;
					}

					
				}


		}, parent);
			
	},
	saveImage() {
		this.myp5.glitch.saveSafe();
	}

},

	mounted() {
	this.buildSketch(this.sketchParent, this.$props);
	this.isMounted = true;
	},

	watch: {
		$props: {
		handler(newValue) {
			this.myp5.remove();
			this.buildSketch(this.sketchParent, newValue);

		},
		deep: true
		}
	},
	computed: {
		isMobile() {
			return this.windowWidth <= 768;
		}
    },

}

</script>



<style scoped>

</style>
