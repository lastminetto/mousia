function MouseMustache(mouse, angle) {

    this.mouse = mouse;

    this.angle = angle;

    this.intercepted = [];

    let from = this.mouse.object.getPosition().abs();
    let to = new paper.Point(from.x, from.y + 100);

    this.object = new paper.Path.Line(from, to);
    this.object.closed = true;
    this.object.strokeColor = 'blue';
};

MouseMustache.prototype.getInitialPoints = function () {
    let from = this.mouse.object.getPosition().abs();
    let to = new paper.Point(from.x, from.y + 100);

    return { from, to };
}

MouseMustache.prototype.update = function () {

    let initPoints = this.getInitialPoints();

    this.object.segments[0].setPoint(initPoints.from);
    this.object.segments[1].setPoint(initPoints.to);

    let newAngle = (this.angle + this.mouse.angle) - 90;
    this.object.rotate(newAngle, initPoints.from);
};

MouseMustache.prototype.checkObstacle = function (obstacle) {

    let obsObject = obstacle.object;

    if (!obsObject)
        return;

    let intersections = this.object.getIntersections(obsObject);

    let index = this.intercepted.indexOf(obstacle);

    if (intersections.length) {
        if (index == -1)
            this.intercepted.push(obstacle);
    } else {
        if (index > -1)
            this.intercepted.splice(index, 1);

        if (this.intercepted.length == 0)
            this.object.opacity = 0.05;
    }

    this.intercepted.reverse().forEach(o => {
        let oi = this.object.getIntersections(o.object);
        if (oi.length > 0) {
            let to = oi[0].getPoint();
            this.object.segments[1].setPoint(to);
            this.object.opacity = 0.3;
        }
    });
};

MouseMustache.prototype.inputs = function() {
    return [this.intercepted.length > 0];
};

MouseMustache.prototype.clear = function () {
    this.object.remove();
};