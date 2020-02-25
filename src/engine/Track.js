const CHUNK_DURATION = 100; // ms

class Track {
	constructor() {
		this.id = `${Math.random()}`.substring(2);
		console.log('this.id', this.id);
		this.isReady = false;
		this.isRecording = false;
		this.stream = null;
		this.recorder = null;
		this.handleDataAvailable = this.handleDataAvailable.bind(this);
		this.chunks = [];
	}
	handleDataAvailable(event) {
		this.chunks.push(event.data);
	}
	async init(device) {
		await this.createStream(device);
		await this.createRecorder();
		this.isReady = true;
	}
	async createStream(device) {
		this.inputName = device.label;
		const stream = await navigator.mediaDevices.getUserMedia({
			audio: { deviceId: device.deviceId },
		});
		this.stream = stream;
		return this;
	}
	async createRecorder() {
		if (!this.stream) {
			throw new Error(`createStream has to be called before createRecorder`);
		}
		this.recorder = new MediaRecorder(this.stream);
		this.recorder.ondataavailable = this.handleDataAvailable;
		this.recorder.start(CHUNK_DURATION);
		this.recorder.pause();
	}
	startRecording() {
		this.isRecording = true;
		this.recorder.resume();
	}
	stopRecording() {
		this.isRecording = false;
		this.recorder.pause();
		// Should we requestData on the recorder after the pause to receive the last data?
		const blob = new Blob(this.chunks);
		const link = URL.createObjectURL(blob);
		this.link = link;
	}

}

export default Track;
