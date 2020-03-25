class Mixer {
	constructor(engine) {
		this.engine = engine;
		this.channels = [];

		this.mainVolume = engine.context.createGain();
		this.output = engine.context.createChannelMerger();

		// channels => output => mainVolume
		this.output.connect(this.mainVolume);
		this.mainVolume.connect(engine.context.destination);
	}
	addChannel() {
		const channel = {
			volume: this.engine.context.createGain(),
		};
		channel.volume.connect(this.output);
		this.channels.push(channel);
		return channel;
	}
}

export default Mixer;
