function Game() {

    this.width = 800;
    this.height = 800;

    this.trapsCount = 5;
    this.ratsCount = 1;

};

Game.prototype.start = function (canvasId) {

    var canvas = document.getElementById(canvasId);
    canvas.width = this.width;
    canvas.height = this.height;

    paper.setup(canvas);

    this.info = new Info();

    this.wall = new Wall();

    this.cheese = new Cheese();

    this.traps = [];
    for (let i = 0; i < this.trapsCount; i++)
        this.traps.push(new MouseTrap());

    this.genetic = new Genetic();
    this.genetic.createNetwork(this.ratsCount);

    this.restart();
};

Game.prototype.restart = function () {

    this.score = 0;
    this.active = 0;

    this.rats = [];
    for (let i = 0; i < this.ratsCount; i++)
        this.rats.push(new Mouse());

    this.loop();

};

Game.prototype.end = function () {
    cancelAnimationFrame(this.animation);

    setTimeout(() => {
        this.restart();
    }, 500);
};

Game.prototype.loop = function () {

    this.liveRats = this.rats.filter(x => x.alive).length;

    this.info.update(this.score, this.liveRats, this.genetic.generation, this.genetic.fitness, this.active);

    this.rats.forEach(m => {
        m.update(this.cheese, ...this.traps, this.wall, this.cheese);

        if (m.score > this.score)
            this.score = m.score;

    });

    if (this.liveRats > 0) {
        this.animation = requestAnimationFrame(this.loop.bind(this));
    } else {
        this.end();
        this.genetic.crossOver();
    }
};

Game.prototype.moveLeft = function () {
    this.rats.filter(r => r.alive && !r.ends).forEach(r => r.moveLeft());
};

Game.prototype.moveRigth = function () {
    this.rats.filter(r => r.alive && !r.ends).forEach(r => r.moveRigth());
};

Game.prototype.goForward = function () {
    this.rats.filter(r => r.alive && !r.ends).forEach(r => r.goForward());
};