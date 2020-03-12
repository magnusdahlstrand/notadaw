class Waveform {
	constructor(chunk) {
		this.isPending = true;
		this.bitmap = null;
		this.chunk = chunk;
		this.paintWaveform = this.paintWaveform.bind(this);
		setTimeout(this.paintWaveform, 0);
	}
	paintWaveform() {
		// TODO: Draw a waveform based on the chunk
	}
}

export default Waveform;
