const _ = require('underscore');
const React = require('react');
const Reflux = require('reflux');
const ansiUp = require('ansi_up');
const scrollTop = require('simple-scrolltop');
const buildStore = require('../../stores/build');
const terminalStore = require('../../stores/terminal');
const utils = require('../../utils');
const template = require('./index.jade');

const Component = React.createClass({
	mixins: [Reflux.ListenerMixin],

	shouldScrollBottom: true,
	data: [],
	linesCount: 0,

	componentDidMount() {
		this.listenTo(terminalStore, this.updateItems);
		this.initialScrollPosition = 120;
		if (this.props.showPreloader) {
			this.setPreloaderDisplay(true);

			this.listenTo(buildStore, function (build) {
				if (build.completed) {
					this.setPreloaderDisplay(false);
				}
			});
		}

		window.onscroll = this.onScroll;
	},
	setPreloaderDisplay(show) {
		const preloader = document.getElementsByClassName('js-terminal-preloader')[0];
		if (show) {
			preloader.style.display = 'block';
		} else {
			preloader.style.display = 'none';
		}
	},
	componentWillUnmount() {
		window.onscroll = null;
	},
	prepareRow(row) {
		return ansiUp.ansi_to_html(utils.escapeHtml(row.replace('\r', '')));
	},
	prepareOutput(output) {
		const self = this;
		return output.map((row) => {
			return self.prepareRow(row);
		});
	},
	getTerminal() {
		return document.getElementsByClassName('terminal')[0];
	},
	onScroll() {
		const node = this.getTerminal();

		this.shouldScrollBottom = window.innerHeight + scrollTop() >=
			node.offsetHeight + this.initialScrollPosition;
	},
	ensureScrollPosition() {
		if (this.shouldScrollBottom) {
			const node = this.getTerminal();

			scrollTop(this.initialScrollPosition + node.offsetHeight);
		}
	},
	makeCodeLineContent(line) {
		return `${'<span class="code-line_counter"></span>' +
			'<div class="code-line_body">'}${this.prepareRow(line)}</div>`;
	},
	makeCodeLine(line, index) {
		return `<div class="code-line" data-number="${index}">${
			this.makeCodeLineContent(line)}</div>`;
	},
	renderBuffer: _.throttle(function () {
		const {data} = this;
		const currentLinesCount = data.length;
		const terminal = document.getElementsByClassName('terminal_code')[0];
		const rows = terminal.childNodes;

		if (rows.length) {
			// replace our last node
			const index = this.linesCount - 1;
			rows[index].innerHTML = this.makeCodeLineContent(data[index]);
		}

		const self = this;
		terminal.insertAdjacentHTML('beforeend',
			_(data.slice(this.linesCount)).map((line, index) => {
				return self.makeCodeLine(line, self.linesCount + index);
			}).join(''));

		this.linesCount = currentLinesCount;
		this.ensureScrollPosition();
	}, 100),
	updateItems(build) {
		// listen just our console update
		if (build.buildId === this.props.build) {
			this.data = build.data;
			this.renderBuffer();
		}
		if (this.props.showPreloader && build.buildCompleted) {
			this.setPreloaderDisplay(false);
		}
	},
	shouldComponentUpdate() {
		return false;
	},
	render: template
});

module.exports = Component;
