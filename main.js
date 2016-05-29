'use strict';

const PLOT_HEIGHT = 500;

let ab = null;

window.addEventListener('load', () => {
	let graph = new Graph("graph");

	// The cubic Bezier will take 4 points
	let p0 = new Point(50, 250);
	let p1 = new Point(100, 450);
	let p2 = new Point(150, 450);
	let p3 = new Point(250, 250); 
	let cb = new CubicBezier(p0, p1, p2, p3);

	drawHandles(cb);

	graph.drawCurveFromPoints(cb.drawingPoints);

	ab = new AnyBezier([
		new Point(10, 10),
		new Point(60, 210),
		new Point(110, 210),
		new Point(210, 10),
		new Point(250, 50),
		new Point(300, 490),
		new Point(400, 80)
	]);

	drawHandles(ab);

	graph.drawCurveFromPoints(ab.drawingPoints);


	// Utilty functions
	function drawHandles(b) {
		if (b instanceof CubicBezier) {
			b.p0.mark();
			b.p1.mark();
			b.p2.mark();
			b.p3.mark();
			graph.drawLine(b.p0, b.p1, 1, '#00FF00');
			graph.drawLine(b.p2, b.p3, 1, '#00FF00');
		} else if (b instanceof AnyBezier) {
			if (b.p.length === 1) {
				b.p[0].mark();
				return;
			}
			for (let i = 1; i < b.p.length; i++) {
				if (i == 1 || i == b.p.length-1) {
					b.p[i-1].mark();
					b.p[i].mark();
				}
				graph.drawLine(b.p[i-1], b.p[i], 1, (i==1||i==b.p.length-1)?'#00FF00':'#AA4444');
			}
			if (b.p.length === 1) {
				b.p[0].mark();
				return;
			}
		}
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

class AnyBezier {

	constructor(p) {

		if ( p instanceof Point ) {
			this.p = [];
			for ( let i = 0; i < arguments.length; i++ ) {
				if ( arguments[i] instanceof Point ) {
					this.p.push(arguments[i]);
				}
			}
		} else if ( typeof p === 'object' ) {
			this.p = p;
		} else {
			this.p = [];
		}

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
		let x = 0;
		let y = 0;
		let n = this.p.length - 1;
		for ( let i = 0; i <= n; i++ ) {
			let bin = binomial(n, i) * Math.pow((1-t), (n-i)) * Math.pow(t, i);
			x += bin * this.p[i].x;
			y += bin * this.p[i].y;
		}

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


function binomial(n, k) {
	if ( (typeof n !== 'number') || (typeof k !== 'number') ) {
		return false;
	}
	var coeff = 1;
	for ( var x = n-k+1; x <= n; x++ ) coeff *= x;
	for ( x = 1; x <= k; x++ ) coeff /= x;
	return coeff;
}
