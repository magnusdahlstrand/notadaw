import React, { Component } from 'react';

class Interface extends Component {
	constructor(props) {
		super(props);
		this.handleEngineUpdate = this.handleEngineUpdate.bind(this);
		this.handleInit = this.handleInit.bind(this);
		this.handleRecord = this.handleRecord.bind(this);
		this.handleStop = this.handleStop.bind(this);
		this.engine = this.props.engine;
		if (!this.engine) {
			throw new Error(`Engine missing`);
		}
	}
	componentDidMount() {
		this._engineListener = this.engine.onUpdate(this.handleEngineUpdate);
	}
	componentWillUnmount() {
		this._engineListener();
	}
	handleEngineUpdate(timecode) {
		this.setState({
			timecode,
		});
	}
	handleInit() {
		this.engine.init();
	}
	handleRecord() {
		this.engine.startRecording();
	}
	handleStop() {
		this.engine.stopRecording();
	}
	render() {
		if (!this.engine.isReady) {
			return (
				<button onClick={this.handleInit}>start</button>
			);
		}
		const RECORDING_STYLE = {
			background: 'red',
			color: 'white'
		};
		return (
			<main>
				<aside>
					{this.engine.isRecording
						? (<p style={RECORDING_STYLE}>Recording</p>)
						: (<p>Ready</p>)
					}
					{this.engine.isRecording
						? (<button onClick={this.handleStop}>Stop</button>)
						: (<button onClick={this.handleRecord}>Record</button>)
					}

				</aside>
				<section>
					{this.engine.tracks.map((track) => (
						<article key={track.id} style={track.isRecording ? RECORDING_STYLE : {}}>
							<h1>{track.inputName}</h1>
							{track.link && (
								<audio src={track.link} controls />
							)}
						</article>
					))}
				</section>
			</main>
		);
	}
}

export default Interface;
