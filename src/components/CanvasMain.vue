<template>
<div class="container mt-3">
    <div id="glitchCanvas" class="p5sketch"></div>
</div>

</template>


<script>

export default {

	props: {
		byteFindVal: Number,
		byteRepVal: Number,
		numRandomBytes: Number,
		loadQuality: Number,
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

	buildSketch(elm, p){

		let parent = document.getElementById(elm);
		let limitBytesStart = this.limitBytesStart / 100;
		let limitBytesEnd = this.limitBytesEnd / 100;
		let loadQuality = this.loadQuality / 100;

			this.myp5 = new p5( function(sketch){
				sketch.glitch;

				sketch.preload = () => {
					sketch.glitch = new Glitch(sketch);
					sketch.glitch.loadType(p.glitchExtType);
					sketch.glitch.loadQuality(loadQuality);
					sketch.glitch.loadImage(p.imgSrc, function(){
						sketch.glitched();
					});

				}

				sketch.setup = () => {
					sketch.createCanvas(p.imgW, p.imgH);
					sketch.background(0);
					sketch.imageMode(sketch.CENTER);
					sketch.glitch.errors(false);
					sketch.disableFriendlyErrors = true;
					sketch.noLoop();
				}

			sketch.draw = () => {
				console.log('draw');
				
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
