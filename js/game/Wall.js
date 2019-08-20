function Wall() {

    this.object = new paper.Path.Rectangle(new paper.Point(200, 300), [400, 20]);
    this.object.fillColor = 'black';

    this.killer = false;
    this.finish = false;
    this.block = true;

}
