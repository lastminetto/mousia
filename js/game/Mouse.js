function Mouse() {

    this.score = 0;

    this.angle = 0;
    this.x = 395;
    this.y = 35;

    this.positionChanged = true;

    this.angleStep = 5;
    this.speed = 5;

    this.mustachesCount = 5;

    this.blocked = false;
    this.alive = true;
    this.ends = false;

    let to = new paper.Point(this.x, this.y);

    this.object = new paper.Path.Circle(to, 10);
    this.object.fillColor = '#ececec';
    this.object.strokeColor = 'gray';
    this.object.strokeWidth = 2;

    let directionFrom = new paper.Point(this.x, this.y);
    let directionTo = new paper.Point(this.x, this.y + this.speed);

    this.forward = new paper.Path.Line(directionFrom, directionTo);
    this.forward.closed = true;
    this.forward.strokeColor = 'green';
    this.forward.strokeWidth = 2;

    let backFrom = new paper.Point(this.x, this.y - this.speed);

    this.backward = new paper.Path.Line(backFrom, directionFrom);
    this.backward.closed = true;
    this.backward.strokeColor = 'red';
    this.backward.strokeWidth = 2;

    let mouseAngleStep = 180 / (this.mustachesCount - 1);

    this.mustaches = [];
    for (let i = 0; i < this.mustachesCount; i++)
        this.mustaches.push(new MouseMustache(this, mouseAngleStep * i));

};

Mouse.prototype.inputs = function () {

};

Mouse.prototype.update = function (cheese) {

    if (this.ends || !this.alive)
        return;

    let to = new paper.Point(this.x, this.y);
    this.object.setPosition(to);

    if (this.positionChanged) {

        if (!this.blocked) {
            let cheesePoint = cheese.object.getPosition().getDistance(to);
            let cheeseDistance = this.object.getPosition().getDistance(cheesePoint);

            this.score += (800 - +cheeseDistance.toFixed(0));
        }

        this.positionChanged = false;
    }

    for (i = 0; i < arguments.length; i++) {
        let obstacle = arguments[i];

        if (this.x > 800 || this.y > 800 || this.x < 0 || this.y < 0) {
            this.alive = false;
            continue;
        }

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

    this.updateDiretionLine();
};

Mouse.prototype.moveLeft = function () {

    if (this.blocked) {
        let to = this.backward.segments[0].getPoint();

        this.x = to.x;
        this.y = to.y;

        this.blocked = false;
    }

    this.angle += this.angleStep;

    this.updateDiretionLine();
};

Mouse.prototype.moveRigth = function () {

    if (this.blocked) {
        let to = this.backward.segments[0].getPoint();

        this.x = to.x;
        this.y = to.y;

        this.blocked = false;
    }

    this.angle -= this.angleStep;

    this.updateDiretionLine();
};

Mouse.prototype.goForward = function () {

    this.positionChanged = true;

    if (!this.blocked) {

        let to = this.forward.segments[1].getPoint();

        this.x = to.x;
        this.y = to.y;

        this.updateDiretionLine();
    }
};

Mouse.prototype.updateDiretionLine = function () {
    let from = new paper.Point(this.x, this.y);
    let to = new paper.Point(this.x, this.y + this.speed);

    this.forward.segments[0].setPoint(from);
    this.forward.segments[1].setPoint(to);
    this.forward.rotate(this.angle, from);

    let fromBack = new paper.Point(this.x, this.y - this.speed);

    this.backward.segments[0].setPoint(fromBack);
    this.backward.segments[1].setPoint(from);
    this.backward.rotate(this.angle, from);
};
