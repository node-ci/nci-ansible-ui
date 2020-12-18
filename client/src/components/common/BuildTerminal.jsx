import _ from 'underscore';
import {useEffect} from 'react';
import {observer} from 'mobx-react';
import scrollTop from 'simple-scrolltop';
import {ansi_to_html} from 'ansi_up';
import {escapeHtml} from '../../utils';
import './BuildTerminal.css';

// could be only one such a terminal in a view port
const BuildTerminal = observer(({
	buildModel, showPreloader
}) => {
	const initialScrollPosition = 120;
	let shouldScrollBottom = true;

	const setPreloaderDisplay = (show) => {
		const preloader = (
			document.getElementsByClassName('js-terminal-preloader')[0]
		);
		preloader.style.display = show ? 'block' : 'none';
	};

	const getTerminal = () => document.getElementsByClassName('terminal')[0];

	const onScroll = () => {
		const node = getTerminal();
		if (node) {
			shouldScrollBottom = (
				window.innerHeight + scrollTop() >=
				node.offsetHeight + initialScrollPosition
			);
		}
	};

	const prepareRow = (row) => ansi_to_html(escapeHtml(row.replace('\r', '')));

	const ensureScrollPosition = () => {
		if (shouldScrollBottom) {
			const node = getTerminal();
			scrollTop(initialScrollPosition + node.offsetHeight);
		}
	};

	const makeCodeLineContent = (line) => {
		return (
			'<span class="code-line_counter"></span>' +
			`<div class="code-line_body">${prepareRow(line)}</div>`
		);
	};

	const makeCodeLine = (line, index) => {
		return (
			`<div class="code-line" data-number="${index}">` +
			`${makeCodeLineContent(line)}</div>`
		);
	};

	let linesCount = 0;

	const renderBuffer = _.throttle((data) => {
		const currentLinesCount = data.length;
		const terminal = document.getElementsByClassName('terminal_code')[0];
		const rows = terminal.childNodes;

		if (rows.length) {
			// replace our last node
			const index = linesCount - 1;
			rows[index].innerHTML = makeCodeLineContent(data[index]);
		}

		terminal.insertAdjacentHTML('beforeend',
			_(data.slice(linesCount)).map((line, index) => {
				return makeCodeLine(line, linesCount + index);
			}).join(''));

		linesCount = currentLinesCount;
		ensureScrollPosition();
	}, 100);

	const renderTerminalData = ({data, buildCompleted}) => {
		renderBuffer(data);
		if (showPreloader && buildCompleted) setPreloaderDisplay(false);
	};

	useEffect(() => {
		if (showPreloader) {
			setPreloaderDisplay(true);
			// TODO: need to somehow hide preloader on build completion
		}

		window.onscroll = onScroll;

		buildModel.getTerminalData(renderTerminalData);

		return () => {
			window.onscroll = null;
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);


	return (
		<div className="terminal">
			<pre className="terminal_code" />
			<div style={{display: 'none'}} className="text-center js-terminal-preloader">
			<img src="/images/preloader.gif" alt="preloader" width="48" height="48" /></div>
			<p />
		</div>
	);
});

export default BuildTerminal;
