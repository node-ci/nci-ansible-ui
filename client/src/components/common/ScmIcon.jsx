import {observer} from 'mobx-react';

const ScmIcon = observer(({scm}) => {
	let scmClassName = '';
	if (scm === 'mercurial') {
		scmClassName = 'si-hg';
	} else if (scm === 'git') {
		scmClassName = 'si-git';
	} else {
		return null;
	}

	return (
		<i className={`si si-fw ${scmClassName}`} />
	);
});

export default ScmIcon;
