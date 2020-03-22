import React, { Component } from 'react';

import Timeline from '~Interface/Timeline';
import Toolbar from '~Interface/Toolbar';

import css from './Interface.css';

class Interface extends Component {
	constructor(props) {
		super(props);
		this.handleEngineUpdate = this.handleEngineUpdate.bind(this);
		this.handleEnginePing = this.handleEnginePing.bind(this);
		if (!this.props.engine) {
			throw new Error('Engine missing');
		}
	}
	componentDidMount() {
		this._engineUpdateListener = this.props.engine.onUpdate(this.handleEngineUpdate);
		this._enginePingListener = this.props.engine.onPing(this.handleEnginePing);
	}
	componentWillUnmount() {
		this._engineListener();
	}
	handleEnginePing(timecode) {
		this.setState({
			timecode,
		});
	}
	handleEngineUpdate(timecode) {
		this.setState({
			timecode,
		});
	}
	render() {
		const engine = this.props.engine;
		if (!engine.isReady) {
			return (
				<button onClick={engine.init}>start</button>
			);
		}
		return (
			<main className={css.Interface}>
				<Toolbar className={css.Interface__toolbar} engine={engine} />
				<Timeline className={css.Interface__timeline} engine={engine} />
			</main>
		);
	}
}

export default Interface;
