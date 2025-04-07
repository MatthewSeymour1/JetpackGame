class Laser {
    constructor(obj) {
        this.x = width;
        this.y = random(height);
        this.width = 20;
        this.height = 5;
        this.speed = 5;
    }

    move() {
        this.x -= this.speed;
    }

    show() {
        fill(255, 0, 0);
        rect(this.x, this.y, this.width, this.height);
    }
}