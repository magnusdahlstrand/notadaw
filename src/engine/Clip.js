// Each clip references a source as well as a start and
// end time within that source.
// It provides an interface to a span of audio buffers
// within the source.

class Clip {
	constructor({ source }) {
		this.id = `${Math.random()}`.substring(2);
		if (!source) {
			throw new Error('Cannot create a Clip without a source');
		}
		this.source = source;
	}
	start() {
		this.startTime = this.source.getCurrentTime();
		this.isRecording = true;
	}
	end() {
		if (!this.isRecording) {
			throw new Error(`Clip has already finished recording, cannot end`);
		}
		this.isRecording = false;
		this.endTime = this.source.getCurrentTime();
	}
	getWaveform() {
		return this.source.getWaveform(this.startTime, this.endTime);
	}
	getChunks() {
		return this.source.getChunks(this.startTime, this.endTime);
	}
}

export default Clip;
