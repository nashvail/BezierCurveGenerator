'use strict';

const PLOT_HEIGHT = 500;

window.addEventListener('load', () => {

	let graph = new Graph("graph");


	let bezierCurve = new BezierCurve([
		new Point(10, 10),
		new Point(70, 310),
		new Point(210, 210),
		new Point(210, 10),
		// new Point(350, 50),
		// new Point(200, 290),
		// new Point(400, 80),
		// new Point(420, 100)
	]);

	drawHandles(graph, bezierCurve);
	graph.drawCurveFromPoints(bezierCurve.drawingPoints);

});


/*
* Class : Point( x coordinate, y coordinate )
* -------------------------------------------
* Represents a single point on the plot.
*/

class Point {

	constructor(x = 0, y = 0) {
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

/*
* Class : BezierCurve( Collection of n points for a curve of degree n)
* ------------------------------------------------------------------
* Represents a Bezier curve, the number of points passed in the con-
* structor determine the degree of the curve.
*/

class BezierCurve {

	constructor(points) {

		if ( points instanceof Point ) {
			this.points = [];
			for ( let i = 0; i < arguments.length; i++ ) {
				if ( arguments[i] instanceof Point ) {
					this.points.push(arguments[i]);
				}
			}
		} else if ( typeof points === 'object' ) {
			this.points = points;
		} else {
			this.points = [];
		}

		// Drawing points are the number of points that render the curve, 
		// the more the number of drawing points, smoother the curve.
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
		let n = this.points.length - 1;
		for ( let i = 0; i <= n; i++ ) {
			let bin = C(n, i) * Math.pow((1-t), (n-i)) * Math.pow(t, i);
			x += bin * this.points[i].x;
			y += bin * this.points[i].y;
		}

		return (new Point(x, PLOT_HEIGHT - y));
	}
}

/*
* Class : Graph(id of the svg container)
* -------------------------------------------
* Represents a graph and exports methods for 
* drawing lines and curves.
*/
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


// Utilty functions

function drawHandles(graph, curve) {
	if (curve.points.length === 1) {
		curve.points[0].mark();
		return;
	}
	for (let i = 1; i < curve.points.length; i++) {
		if (i == 1 || i == curve.points.length-1) {
			curve.points[i-1].mark();
			curve.points[i].mark();
		}
		graph.drawLine(curve.points[i-1], curve.points[i], 1, (i==1||i==curve.points.length-1)?'#00FF00':'#AA4444');
	}
	if (curve.points.length === 1) {
		curve.points[0].mark();
		return;
	}
}

function C(n, k) {
	if ( (typeof n !== 'number') || (typeof k !== 'number') ) {
		return false;
	}
	var coeff = 1;
	for ( var x = n-k+1; x <= n; x++ ) coeff *= x;
	for ( x = 1; x <= k; x++ ) coeff /= x;
	return coeff;
}
