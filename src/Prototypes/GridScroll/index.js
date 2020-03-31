import React, { Component, Fragment, createRef } from 'react';

import css from './GridScroll.css';

class GridScrollPrototype extends Component {
	constructor(props) {
		super(props);
		this.state = {
			origin: {
				x: 0,
				y: 0,
			},
			nodes: [this.createNewNode({ x: 0, y: 0 })],
			selection: [],
		};
		this.$rootEl = createRef();
		this.handleWheel = this.handleWheel.bind(this);
		this.handleClick = this.handleClick.bind(this);
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
			// console.log('wheel!', oldState.origin.x + data.deltaX, oldState.origin.y + data.deltaY);
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
			this.setState(({ origin, nodes }) => {
				const x = data.pageX - origin.x;
				const y = data.pageY - origin.y;
				const newNode = this.createNewNode({ x, y });
				return {
					nodes: [...nodes, newNode]
				}
			});
		} else {
			const clickedNode = this.state.nodes.find((node) => event.target === node.$el.current);
			console.log('clicked!', clickedNode);
			this.selectNode(clickedNode, { extend: data.shiftKey, subtract: data.altKey });
		}
	}
	createNewNode({ x, y }) {
		return {
			id: Math.random(),
			x: x,
			y: y,
			w: 300,
			h: 150,
			$el: createRef(),
		}
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
				className={css.root}
				onWheel={this.handleWheel}
				onClick={this.handleClick}
				ref={this.$rootEl}
			>
				{this.renderNodes()}
			</main>
		);
	}
}

export default GridScrollPrototype;
