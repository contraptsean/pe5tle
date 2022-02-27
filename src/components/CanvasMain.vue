<template>
<div ref="sketchWrapper">
	<main class="main" id="main">
    	<div id="glitchCanvas" class="p5sketch pt-1"></div>
	</main>
</div>
<Teleport v-if="isMounted" to="#saveWrapperMobile">
	<button type="button" class="btn btn-secondary" @click="saveImage">
	Save
	<i class="bi bi-save ms-1"></i>
	</button>
</Teleport>

<Teleport v-if="isMounted" to="#saveWrapperDesktop">
	<button type="button" class="btn btn-secondary mt-3" @click="saveImage">
	Save Full Size
	<i class="bi bi-save ms-2"></i>
	</button>
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
		loadQuality: Number,
		imgSrc: String,
		imgW: Number,
		imgH: Number,
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
			buffer: {},
			 }
	},

  	methods: {

	buildSketch(elm, p){
		//console.log(this.$refs.sketchWrapper.clientWidth)
		let containerWidth = this.$refs.sketchWrapper.clientWidth;
		let containerHeight = window.innerHeight;
		let parent = document.getElementById(elm);
		let limitBytesStart = this.limitBytesStart / 100;
		let limitBytesEnd = this.limitBytesEnd / 100;
		let loadQuality = this.loadQuality / 100;
		let isMobile = this.isMobile;
		let img0;
		let capture;

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
					sketch.createCanvas((containerWidth), (containerHeight - 10));					
					sketch.pixelDensity(1)
					if (isMobile) {
						sketch.imageMode(sketch.CORNER);
					} else {
						sketch.imageMode(sketch.CENTER);
					}
					sketch.glitch.errors(false);
					sketch.disableFriendlyErrors = true;
					sketch.noLoop();

				}

				sketch.draw = () => {

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

					sketch.glitch.loadImage(sketch.glitch.image);
					sketch.glitch.buffer = sketch.glitch.bytes.slice();
						
					if (isMobile) {
						sketch.glitch.image.resize(containerWidth, 0);
						img0.resize(containerWidth, 0);
						sketch.image(sketch.glitch.image, 0,0);
					} else {
						sketch.glitch.image.resize(0, containerHeight);
						img0.resize(0, containerHeight);
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
		this.myp5.glitch.bytes = this.myp5.glitch.buffer.slice();
		this.myp5.glitch.buildImage(function(img){
				// custom timestamp for exporting
					let d = new Date();
					d.setTime( d.getTime() - new Date().getTimezoneOffset()*60*1000 );
					let ts = d.toISOString().replace(/[^0-9]/g, '').slice(0, -3);
					img.save('pe5tle_' + ts);
			});

		console.log(this.myp5);
		console.log(this.myp5.glitch);

	},



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

