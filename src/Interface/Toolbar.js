import React from 'react';
import classnames from 'classnames';

import css from './Toolbar.css';

const Toolbar = ({ className, engine }) => (
	<aside className={classnames(className, css.Toolbar)}>
		{engine.isRecording
			? (<p>Recording</p>)
			: (<p>Ready</p>)
		}
		{engine.isRecording
			? (<button onClick={engine.stopRecording}>Stop</button>)
			: (<button onClick={engine.startRecording}>Record</button>)
		}
		<button onClick={engine.startPlayback}>Play</button>

	</aside>
);

export default Toolbar;
