import React from 'react';
import classnames from 'classnames';

import css from './Track.css';

const Track = ({ track }) => (
	<article className={classnames(css.Track, track.isRecording && css.isRecording)}>
		<h1 className={css.Track__name}>{track.inputName}</h1>
		<div className={css.Track__waveform}>
			{track.link && (
				<audio src={track.link} controls />
			)}
		</div>
		<div className={css.Track__setup}>
			<div className={css.Track__sources}>
				<div className={css.Track__source}>1</div>
				<div className={css.Track__source}>2</div>
				<div className={classnames(css.Track__source, css.isActive)}>3</div>
				<div className={css.Track__source}>4</div>
				<div className={css.Track__source}>5</div>
				<div className={css.Track__source}>6</div>
				<div className={css.Track__source}>7</div>
				<div className={css.Track__source}>8</div>
			</div>
		</div>
	</article>
);

export default Track;
