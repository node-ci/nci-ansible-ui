import {observer} from 'mobx-react';

const Duration = observer(({value, withSuffix, title}) => {
	let sec = value / 1000;
	sec = sec >= 1 ? Math.round(sec) : Number(sec.toFixed(2));
	const min = sec >= 60 ? Math.round(sec / 60) : 0;
	const suffix = withSuffix ? 'in ' : '';
	const ending = min === 1 ? '' : 's';
	const tip = title || sec + ' second' + ending;
	const durationText = min ? `${min} minute` : `${sec} second`;
	const text = `${suffix}${durationText}${ending}`;

	return (
		<span title={tip}>{text}</span>
	);
});

export default Duration;
