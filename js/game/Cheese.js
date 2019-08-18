function Cheese() {
    
    this.killer = false;
    this.finish = true;
    this.block = true;

    let to = new paper.Point(395, 750);

    this.object = new paper.Path.Circle(to, 20);
    this.object.fillColor = 'yellow';
    this.object.strokeColor = 'pink';
    this.object.strokeWidth = 2;

}