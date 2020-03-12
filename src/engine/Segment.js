import Waveform from './Waveform';

class Segment {
	constructor({ chunk, startTime, length }) {
		this.chunk = chunk;
		this.startTime = startTime;
		this.endTime = null;
		this.length = length;
		this.waveform = new Waveform(chunk);
	}
	isWithinTimespan(start, end) {
		// TODO: This only selects segments which are fully within the timespan
		// and not those which started before or ended after.
		if (this.startTime < start) {
			return false;
		}
		if (!this.endTime) {
			return true;
		}
		return this.endTime < end;
	}
}

export default Segment;
