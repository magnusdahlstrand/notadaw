import React from 'react';
import classnames from 'classnames';

import css from './Clip.css';

const Clip = ({ clip }) => (
	<article className={classnames(css.Clip, clip.isRecording && css.isRecording)}>
		Clip {clip.id}
		{!clip.isRecording && <button onClick={() => console.log(clip)}>Play</button>}
	</article>
);

export default Clip;
