'use strict';

const PLOT_HEIGHT = 500;

window.addEventListener('load', () => {
	let graph = new Graph("graph");

	// The cubic Bezier will take 4 points 
	let p0 = new Point(100, 50);
	let p1 = new Point(150, 250);
	let p2 = new Point(200, 250);
	let p3 = new Point(300, 50); 
	let cb = new CubicBezier(p0, p1, p2, p3);

	p0.mark();
	p1.mark();
	p2.mark();
	p3.mark();
	drawHandles();

	graph.drawCurveFromPoints(cb.drawingPoints);


	// Utilty functions
	function drawHandles() {
		graph.drawLine(p0, p1, 1, '#00FF00');
		graph.drawLine(p2, p3, 1, '#00FF00');
	}
});


class Point {

	constructor(x, y) {
		this.x = x;
		/*
			The reason to the following is because we 
			want the origin to be at bottom left corner 
			instead of the top left.	
		*/
		this.y = PLOT_HEIGHT - y;
	}

	x() {
		return this.x;
	}

	y() {
		return this.y;
	}

	mark() {
		document.getElementById('graph').insertAdjacentHTML('beforeend', `<circle cx="${this.x}" cy="${this.y}" r="5" fill="#000" />`);
	}

}

class CubicBezier {

	constructor(p0, p1, p2, p3) {

		this.p0 = p0;
		this.p1 = p1;
		this.p2 = p2;
		this.p3 = p3;

		this.numDrawingPoints = 100;
		this.drawingPoints = [];

		this.calculateDrawingPoints();
	}

	calculateDrawingPoints() {
		let interval = 1 / this.numDrawingPoints;
		let t = interval;

		this.drawingPoints.push(this.calculateNewPoint(0));

		for( let i = 0; i < this.numDrawingPoints; i++ ) {
			this.drawingPoints.push(this.calculateNewPoint(t));
			t += interval;
		}

	}

	calculateNewPoint(t) {
		// Coordinates calculated using the general formula are relative to 
		// origin at bottom left.
		let x = (
			(Math.pow( (1 - t), 3) * this.p0.x) + 
			(3 * Math.pow( (1 - t), 2) * t * this.p1.x) +
			(3 * (1 - t) * Math.pow(t, 2) * this.p2.x) +
			(Math.pow(t, 3) * this.p3.x)
		);

		let y = (
			(Math.pow( (1 - t), 3) * this.p0.y) + 
			(3 * Math.pow( (1 - t), 2) * t * this.p1.y) +
			(3 * (1 - t) * Math.pow(t, 2) * this.p2.y) +
			(Math.pow(t, 3) * this.p3.y)
		);

		return (new Point(x, PLOT_HEIGHT - y));
	}
}

class Graph {

	constructor(id) {
		this.el = document.getElementById(id);
	}

	drawLine(point1, point2, stroke = 2, color = '#000000') {
		this.el.insertAdjacentHTML('beforeend', `<line x1="${point1.x}" y1="${point1.y}" x2="${point2.x}" y2="${point2.y}" stroke="${color}" stroke-width="${stroke}" id="line"/>`);
	}	

	drawCurveFromPoints(points) {
		for ( let i = 0; i < points.length; i++ ) {
			if ( i+1 < points.length )
				this.drawLine(points[i], points[i+1]);
		}
	}
}



