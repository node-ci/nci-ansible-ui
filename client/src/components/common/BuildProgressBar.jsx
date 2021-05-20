import {useState, useEffect} from 'react';
import {observer} from 'mobx-react';

const BuildProgressBar = observer(({build}) => {
	const [duration, setDuration] = useState(Date.now() - build.startDate);
	const [mounted, setMounted] = useState(true);

	useEffect(() => {
		setMounted(true);
		return () => setMounted(false);
	}, []);

	if (build.status === 'in-progress') {
		setTimeout(() => {
			if (mounted) setDuration(Date.now() - build.startDate);
		}, 100);
	}

	const avgDuration = build.project.avgBuildDuration;
	const completedPercent = Math.round(duration / avgDuration * 100);
	let remainingTime = Math.round((avgDuration - duration) / 1000);
	remainingTime = remainingTime > 0 ? remainingTime : 0;
	const title = (
		remainingTime ? `Estimated remaining time: ${remainingTime} sec` : ''
	);

	return (
		<div className="progress" title={title}>
			<div
				className="progress-bar progress-bar-success progress-bar-striped active"
				style={{width: `${completedPercent}%`}}
			/>
		</div>
	);
});

export default BuildProgressBar;
