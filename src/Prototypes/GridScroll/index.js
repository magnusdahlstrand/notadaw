import React, { Component, Fragment, createRef } from 'react';

import css from './GridScroll.css';

const GRID = {
	x: 50,
	y: 150,
};

const snap = (value, size) => {
	return value - (value % size);
}

class GridScrollPrototype extends Component {
	constructor(props) {
		super(props);
		this.state = {
			origin: {
				x: 0,
				y: 0,
			},
			nodes: [],
			selection: [],
		};
		this.cache = {
			mouseX: 0,
			mouseY: 0,
			$focus: null,
		};
		this.$rootEl = createRef();
		this.handleWheel = this.handleWheel.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
	}
	componentDidMount() {
		this.$rootEl.current.focus();
	}
	handleWheel(event) {
		const data = {
			deltaX: event.deltaX,
			deltaY: event.deltaY,
			deltaZ: event.deltaZ,
			movementX: event.movementX,
			movementY: event.movementY,
		};
		this.setState(({ origin }) => {
			return {
				origin: {
					x: origin.x - data.deltaX,
					y: origin.y - data.deltaY,
				},
			};
		})
	}
	handleClick(event) {
		const data = {
			pageX: event.pageX,
			pageY: event.pageY,
			isClickOnGrid: event.target === this.$rootEl.current,
			shiftKey: event.shiftKey,
			altKey: event.altKey,
		};
		if (data.isClickOnGrid) {
			this.addNewNode({ x: data.pageX, y: data.pageY });
		} else {
			const clickedNode = this.state.nodes.find((node) => event.target === node.$el.current);
			this.selectNode(clickedNode, { extend: data.shiftKey, subtract: data.altKey });
		}
	}
	handleKeyDown(event) {
		const data = {
			which: event.which,
			charCode: event.charCode,
			keyCode: event.keyCode,
			key: event.key,
			shiftKey: event.shiftKey,
			altKey: event.altKey,
		};
		if (data.key === 't' || data.key === 'T' || data.keyCode === 84) {
			this.addNewNode({
				x: this.cache.mouseX,
				y: this.cache.mouseY,
			});
		}
		if (data.key === 's' || data.key === 'S' || data.keyCode === 83) {
			const node = this.state.nodes.find((node) => node.$el.current === this.cache.$focus);
			if (node) {
				this.selectNode(node, { extend: data.shiftKey, subtract: data.altKey });
			}
		}
	}
	handleMouseMove(event) {
		this.cache.mouseX = event.pageX;
		this.cache.mouseY = event.pageY;
		this.cache.$focus = event.target;
	}
	addNewNode({ x, y }) {
		this.setState(({ origin, nodes }) => {
			const newNode = {
				id: Math.random(),
				x: snap(x - origin.x, GRID.x),
				y: snap(y - origin.y, GRID.y),
				w: 300,
				h: 150,
				$el: createRef(),
			};
			return {
				nodes: [...nodes, newNode]
			}
		});
	}
	selectNode(node, { extend, subtract }) {
		this.setState(({ selection }) => {
			return {
				selection: extend ?
					[...selection, node] :
					(subtract ?
						selection.filter((selected) => selected !== node) :
						[node]
					),
			};
		})
	}
	getNodeStyle(node) {
		const origin = this.state.origin;
		const x = origin.x + node.x;
		const y = origin.y + node.y;
		return {
			width: `${node.w}px`,
			height: `${node.h}px`,
			transform: `translate(${x}px, ${y}px)`,
			backgroundColor: this.isSelected(node) ? 'white' : 'lightgray',
		};
	}
	isSelected(node) {
		return this.state.selection.includes(node);
	}
	renderNodes() {
		const { nodes } = this.state;
		return (
			<Fragment>
				{nodes.map((node) => (
					<div
						key={node.id}
						ref={node.$el}
						style={this.getNodeStyle(node)}
						className={css.node}
					/>
				))}
			</Fragment>
		)
	}
	render() {
		return (
			<main
				tabIndex="0"
				className={css.root}
				onWheel={this.handleWheel}
				onClick={this.handleClick}
				onKeyDown={this.handleKeyDown}
				onMouseMove={this.handleMouseMove}
				ref={this.$rootEl}
			>
				{this.renderNodes()}
			</main>
		);
	}
}

export default GridScrollPrototype;
