import React from 'react';
import classnames from 'classnames';

import Clip from '~/Interface/Clip';

import css from './Track.css';

const Track = ({ track, engine }) => (
	<article className={classnames(css.Track, track.isRecording && css.isRecording)}>
		<h1 className={css.Track__name}>{track.inputName}</h1>
		<section className={css.Track__clips}>
			{track.clips.map((clip) => (
				<Clip key={clip.id} clip={clip} track={track} engine={engine} />
			))}
			{track.link && (
				<audio src={track.link} controls />
			)}
		</section>
		<section className={css.Track__setup}>
			<div className={css.Track__sources}>
				{engine.sources.map((source) => (
					<div
						key={source.id}
						className={classnames(
							css.Track__source,
							track.currentSource === source && css.isActive
						)}
					>
						{source.name}
					</div>
				))}
			</div>
		</section>
	</article>
);

export default Track;
