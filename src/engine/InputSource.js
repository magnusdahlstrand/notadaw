import Segment from './Segment';

const CHUNK_DURATION = 500; // ms

// InputSources are created automatically for each input device.
// It records incoming data, creating segments made up of
// chunks/buffers and waveforms.

class InputSource {
	constructor({ engine, device }) {
		this.engine = engine;
		this.device = device;
		this.stream = null;
		this.analyser = null;
		this.segments = [];
		this.recorder = null;
		this.id = `${Math.random()}`.substring(2);
		this.name = `${Math.random()}`.substring(2, 2);
		console.log('InputSource', this);
		this.isReady = false;
		this.handleDataAvailable = this.handleDataAvailable.bind(this);
	}
	handleDataAvailable(event) {
		this.addSegment(event.data);
	}
	addSegment(chunk) {
		const newSegment = new Segment({
			chunk,
			startTime: this.getCurrentTime(),
			length: CHUNK_DURATION,
		});
		this.segments.push(newSegment);
	}
	getCurrentTime() {
		return this.engine.getCurrentTime();
	}
	async init() {
		this.stream = await this.setupStream();
		this.recorder = await this.setupRecorder();
		// this.analyser = await this.setupAnalyser()
		this.isReady = true;
	}
	async setupStream() {
		this.inputName = this.device.label;
		const stream = await navigator.mediaDevices.getUserMedia({
			audio: { deviceId: this.device.deviceId },
		});
		return stream;
	}
	async setupRecorder() {
		if (!this.stream) {
			throw new Error('Cannot setup recorder without a stream');
		}
		const recorder = new MediaRecorder(this.stream);
		recorder.ondataavailable = this.handleDataAvailable;
		recorder.start(CHUNK_DURATION);
		return recorder;
	}
	setupAnalyser() {
		const analyser = new AnalyserNode();
		console.log('analyser:', analyser);
		return analyser;
	}
	getSegments(start=-Infinity, end=+Infinity) {
		return this.segments
			.filter((segment) => segment.isWithinTimespan(start, end))
		;
	}
	getWaveform(start, end) {
		return this.getSegments(start, end)
			.map((segment) => segment.waveform)
		;
	}
	getChunks(start, end) {
		return this.getSegments(start, end)
			.map((segment) => segment.chunk)
		;
	}
}

export default InputSource;
