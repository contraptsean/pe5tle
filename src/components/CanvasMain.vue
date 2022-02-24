<template>
<div ref="sketchWrapper">
	<main class="main" id="main">
    	<div id="glitchCanvas" class="p5sketch"></div>
	</main>
</div>
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
		sketchParent: String,
		glitchExtType: String,
		glitchType: String,
		limitBytesStart: Number,
		limitBytesEnd: Number,
		windowWidth:Number,
	},

	data() {
		return { myp5:{} }
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

			this.myp5 = new p5( function(sketch){
				//sketch.glitch;
				

				sketch.preload = () => {
					sketch.glitch = new Glitch(sketch);
					sketch.glitch.loadType(p.glitchExtType);
					sketch.glitch.loadQuality(loadQuality);
					sketch.glitch.loadImage(p.imgSrc, function(){
						sketch.glitched();
					});

				}

				sketch.setup = () => {
					sketch.createCanvas((containerWidth - 10 ), (containerHeight - 10));
					sketch.pixelDensity(1)
					sketch.background(255, 255, 255);
					sketch.imageMode(sketch.CENTER);
					sketch.glitch.errors(false);
					sketch.disableFriendlyErrors = true;
					sketch.noLoop();
				}

				sketch.draw = () => {
					console.log(sketch.glitch)
					console.log('draw');
					if (p.windowWidth < 768) {
					sketch.glitch.image.resize(containerWidth, 0);
					} else {
					sketch.glitch.image.resize(0, containerHeight);

					}
					sketch.image(sketch.glitch.image, sketch.width/2, sketch.height/2);
					
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
					}

					
				}


		}, parent);
			
	},
},

	mounted() {
	this.buildSketch(this.sketchParent, this.$props);
	},

	watch: {
		$props: {
		handler(newValue) {
			this.myp5.remove();
			this.buildSketch(this.sketchParent, newValue);

		},
		deep: true
		}
	}

}

</script>



<style scoped>

</style>
