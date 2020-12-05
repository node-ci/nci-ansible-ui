import {observer} from 'mobx-react';
import moment from 'moment';

const DateTime = observer(({value}) => {
	const date = moment(value);
	const title = date.format('YYYY-MM-DD HH:mm:ss');

	return (
		<span title={title}>{date.fromNow()}</span>
	);
});

export default DateTime;
