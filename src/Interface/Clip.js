import React from 'react';
import classnames from 'classnames';

import css from './Clip.css';

const PIXELS_PER_SECOND = 20;

const getClipStyle = (clip) => {
	return {
		width: `${PIXELS_PER_SECOND * clip.length}px`,
	};
};

const Clip = ({ clip }) => (
	<article className={classnames(css.Clip, clip.isRecording && css.isRecording)} style={getClipStyle(clip)}>
		Clip {}
		{!clip.isRecording && <button onClick={() => console.log(clip)}>Play</button>}
	</article>
);

export default Clip;
