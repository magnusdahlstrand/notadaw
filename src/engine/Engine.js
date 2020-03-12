import Track from './Track';
import InputSource from './InputSource';

class Engine {
	constructor() {
		console.log('Engine', this);
		this._updateListeners = [];
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
		const timecode = (new Date()).getTime();
		this._updateTimeout = setTimeout(() => {
			this._updateListeners.forEach((listener) => listener(timecode));
		}, 0);
	}
	async init() {
		this.context = new AudioContext();
		this.tracks = [];
		this.devices = await this.listDevices();
		this.isReady = true;
		this.sources = await this.setupInputSources();
		await this.createTracks(this.sources);
		this._triggerUpdate();
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
		const track = new Track();
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
}

export default Engine;
