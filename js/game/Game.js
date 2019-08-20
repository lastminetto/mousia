function Game() {

    this.width = 800;
    this.height = 800;

    this.trapsCount = 5;
    this.ratsCount = 30;

    this.mouseMustaches = 3;

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
    this.genetic.createNetwork(this.ratsCount, 3, 10, 3);

    this.restart();
};

Game.prototype.restart = function () {

    this.frame = 0;
    this.active = 0;

    this.rats = [];
    for (let i = 0; i < this.ratsCount; i++)
        this.rats.push(new Mouse(this.mouseMustaches));

    this.loop();

};

Game.prototype.end = function () {
    cancelAnimationFrame(this.animation);

    setTimeout(() => {
        this.restart();
    }, 100);
};

Game.prototype.loop = function () {

    this.frame++;

    this.liveRats = this.rats.filter(x => x.alive && !x.ends).length;
    let alreadyEnds = this.rats.some(x => x.ends);

    this.info.update(this.frame, this.liveRats, this.genetic.generation, this.genetic.fitness, this.active);

    this.rats.forEach((m, index) => {
        m.update(...this.traps, this.wall, this.cheese);

        this.genetic.executeNetwork(index, m.score);
        this.activateNetwork(m, index);
    });

    if (this.liveRats > 0) {
        this.animation = requestAnimationFrame(this.loop.bind(this));
    } else {
        this.rats.forEach(m => m.clear());
        this.end();
        this.genetic.crossOverNetworks(alreadyEnds);
    }
};

Game.prototype.activateNetwork = function (mouse, index) {

    let inputs = mouse.inputs();

    var active = this.genetic.activateNetwork(index, inputs);

    if (active[0] > 0.52)
        mouse.moveLeft();

    if (active[1] > 0.52)
        mouse.moveRigth();

    if (active[2] > 0.52)
        mouse.goForward(this.cheese);

    this.active = active[1];
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