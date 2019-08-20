function Info() {

    let point = new paper.Point(10, 20);
    this.object = new paper.PointText(point);

    this.update();
}

Info.prototype.update = function (score, rats, generation, fitness, activate) {

    this.object.content = `Frame ${score || 0} | Rats ${rats || 0} | Generation ${generation || 0} | Fitness ${fitness || 0} | Activate ${(activate || 0).toFixed(5)}`;

};