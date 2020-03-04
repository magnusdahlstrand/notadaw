import React from 'react';
import classnames from 'classnames';

import Track from '~Interface/Track';

import css from './Timeline.css';

const Timeline = ({ className, engine }) => (
	<section className={classnames(className, css.Timeline)}>
		<div className={css.Timeline__tracks}>
			{engine.tracks.map((track) => (
				<Track key={track.id} track={track} />
			))}
		</div>
	</section>
);

export default Timeline;
