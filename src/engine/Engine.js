import Track from './Track';
import Mixer from './Mixer';
import InputSource from './InputSource';

class Engine {
	constructor() {
		console.log('Engine', this);
		this._updateListeners = [];
		this._pingListeners = [];
		this.isReady = false;
		this.isRecording = false;
		for(let key of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
			let fn = this[key];
			if (typeof fn === 'function') {
				this[key] = fn.bind(this);
			}
		}
	}
	onUpdate(callback) {
		this._updateListeners.push(callback);
		return () => {
			const index = this._updateListeners.indexOf(callback);
			if (index !== -1) {
				this._updateListeners.splice(index, 1);
			} else {
				console.warn('Attempted unbind of unbound onUpdate handler');
			}
		};
	}
	_triggerUpdate() {
		clearTimeout(this._updateTimeout);
		const timecode = this.getCurrentTime();
		this._updateTimeout = setTimeout(() => {
			this._updateListeners.forEach((listener) => listener(timecode));
		}, 0);
	}
	onPing(callback) {
		this._pingListeners.push(callback);
		return () => {
			const index = this._pingListeners.indexOf(callback);
			if (index !== -1) {
				this._pingListeners.splice(index, 1);
			} else {
				console.warn('Attempted unbind of unbound onPing handler');
			}
		};
	}
	_triggerPing() {
		clearTimeout(this._pingTimeout);
		const timecode = this.getCurrentTime();
		this._pingListeners.forEach((listener) => listener(timecode));
		requestAnimationFrame(this._triggerPing);
	}
	async init() {
		this.context = new AudioContext();
		this.tracks = [];
		this.mixer = new Mixer(this);
		this.devices = await this.listDevices();
		this.isReady = true;
		this.sources = await this.setupInputSources();
		await this.createTracks(this.sources);
		this._triggerUpdate();
		this._triggerPing();
		return this;
	}
	getCurrentTime() {
		return this.context.currentTime;
	}
	async setupInputSources() {
		return this.devices.input.map((inputDevice) => this.addInputSource(inputDevice));
	}
	async createTracks(sources) {
		return await Promise.all(sources.map((source) => this.addTrack(source)));
	}
	addInputSource(inputDevice) {
		const source = new InputSource({ engine: this, device: inputDevice });
		source.init();
		this._triggerUpdate();
		return source;
	}
	async listDevices() {
		const devices = await navigator.mediaDevices.enumerateDevices();
		const input = devices.filter((device) => device.kind === 'audioinput');
		const output = devices.filter((device) => device.kind === 'audiooutput');
		return {
			input,
			output,
		};
	}
	async addTrack(source) {
		const track = new Track(this);
		await track.pickSource(source);
		this.tracks.push(track);
		this._triggerUpdate();
		return track;
	}
	startRecording() {
		this.tracks.forEach((track) => {
			track.startRecording();
		});
		this.isRecording = true;
		this._triggerUpdate();
		return this;
	}
	stopRecording() {
		this.tracks.forEach((track) => {
			track.stopRecording();
		});
		this.isRecording = false;
		this._triggerUpdate();
		return this;
	}
	startPlayback() {
		console.log('Start playback');
		this.tracks.forEach(async (track) => {
			const buffer = await track.getBuffer();
			const bufferSource = this.context.createBufferSource();
			bufferSource.buffer = buffer;
			bufferSource.connect(track.channel.volume);
			bufferSource.start(this.getCurrentTime());
		})
	}
}

export default Engine;
