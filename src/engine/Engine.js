import Track from './Track';

class Engine {
	constructor() {
		console.log('Engine', this);
		this._updateListeners = [];
		this.isReady = false;
		this.isRecording = false;
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
		await this.createTracks();
		this._triggerUpdate();
		return this;
	}
	async createTracks() {
		await Promise.all(this.devices.input.map((device) => this.addTrack(device)));
		return this;
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
	async addTrack(device) {
		const track = new Track();
		await track.init(device);
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
