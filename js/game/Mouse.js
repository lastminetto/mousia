function Mouse() {

    this.angle = 0;
    this.x = 395;
    this.y = 35;

    this.angleStep = 10;
    this.speed = 5;

    this.mustachesCount = 10;

    this.blocked = false;
    this.alive = true;
    this.ends = false;

    let to = new paper.Point(this.x, this.y);

    this.object = new paper.Path.Circle(to, 10);
    this.object.fillColor = '#ececec';
    this.object.strokeColor = 'red';
    this.object.strokeWidth = 2;

    let directionFrom = new paper.Point(this.x, this.y);
    let directionTo = new paper.Point(this.x, this.y + this.speed);

    this.direction = new paper.Path.Line(directionFrom, directionTo);
    this.direction.closed = true;
    this.direction.strokeColor = 'green';
    this.direction.strokeWidth = 2;

    let backFrom = new paper.Point(this.x, this.y - this.speed);

    this.back = new paper.Path.Line(backFrom, directionFrom);
    this.back.closed = true;
    this.back.strokeColor = 'blue';
    this.back.strokeWidth = 2;

    let mouseAngleStep = 180 / (this.mustachesCount - 1);

    this.mustaches = [];
    for (let i = 0; i < this.mustachesCount; i++)
        this.mustaches.push(new MouseMustache(this, mouseAngleStep * i));

};

Mouse.prototype.inputs = function () {

};

Mouse.prototype.update = function () {

    for (i = 0; i < arguments.length; i++) {
        let obstacle = arguments[i];

        let intersections = this.object.getIntersections(obstacle.object);

        if (intersections.length) {
            if (obstacle.killer) {
                this.alive = false;
                this.mustaches.forEach(m => m.clear());
            } else if (obstacle.finish) {
                this.ends = true;
                this.mustaches.forEach(m => m.clear());
            } else if (obstacle.block) {
                this.blocked = true;
            }
        }

        this.mustaches.forEach(m => {
            m.update();
            m.checkObstacle(obstacle);
        });
    }

    let to = new paper.Point(this.x, this.y);
    this.object.setPosition(to);

    this.updateDiretionLine();
};

Mouse.prototype.moveLeft = function () {

    if (this.blocked) {
        let to = this.back.segments[0].getPoint();

        this.x = to.x;
        this.y = to.y;

        this.blocked = false;
    }

    this.angle += this.angleStep;

    this.updateDiretionLine();
};

Mouse.prototype.moveRigth = function () {

    if (this.blocked) {
        let to = this.back.segments[0].getPoint();

        this.x = to.x;
        this.y = to.y;

        this.blocked = false;
    }

    this.angle -= this.angleStep;

    this.updateDiretionLine();
};

Mouse.prototype.goForward = function () {

    if (!this.blocked) {
        let to = this.direction.segments[1].getPoint();

        this.x = to.x;
        this.y = to.y;

        this.updateDiretionLine();
    }
};

Mouse.prototype.updateDiretionLine = function () {
    let from = new paper.Point(this.x, this.y);
    let to = new paper.Point(this.x, this.y + this.speed);

    this.direction.segments[0].setPoint(from);
    this.direction.segments[1].setPoint(to);
    this.direction.rotate(this.angle, from);

    let fromBack = new paper.Point(this.x, this.y - this.speed);

    this.back.segments[0].setPoint(fromBack);
    this.back.segments[1].setPoint(from);
    this.back.rotate(this.angle, from);
};
