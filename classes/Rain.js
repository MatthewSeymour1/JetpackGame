class Rain {
    constructor(obj) {
        this.x = random(width);
        this.y = 0;
        this.width = 5;
        this.height = 20;
        this.speed = 5;
    }

    move() {
        this.y += this.speed;
    }

    show() {
        fill(0, 0, 255);
        rect(this.x, this.y, this.width, this.height);
    }
}