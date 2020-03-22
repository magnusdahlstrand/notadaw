import Clip from './Clip';

// A Track is a collection of clips

class Track {
	constructor() {
		this.id = `${Math.random()}`.substring(2);
		this.clips = [];
		this.currentSource = null;
		this.currentClip = null;
		this.isRecording = false;
	}
	get inputName() {
		return this.currentSource.inputName;
	}
	// When selecting a new source, a new clip will be created
	pickSource(source) {
		this.currentSource = source;
	}
	createNewClip() {
		if (!this.currentSource) {
			throw new Error('Track: Cannot create new clip when no source is selected');
		}
		this.endCurrentClip();
		const newClip = new Clip({ source: this.currentSource });
		newClip.start();
		this.currentClip = newClip;
		this.clips.push(newClip);
	}
	endCurrentClip() {
		const oldClip = this.currentClip;
		if (oldClip) {
			oldClip.end();
		}
		this.currentClip = null;
	}
	startRecording() {
		this.createNewClip();
		this.isRecording = true;
	}
	stopRecording() {
		this.endCurrentClip();
		this.isRecording = false;
	}
}

export default Track;
