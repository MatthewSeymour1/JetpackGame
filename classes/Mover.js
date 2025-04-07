class Mover {
    constructor() {
        this.mass = 1;
        this.pos = createVector(30, 30);
        this.vel = createVector(0, 0);
        this.acceleration = createVector(0, 0);
        this.maxSpeed = 10;
        this.width = 70;
        this.height = 70;
    }

    applyForce(force) {
        let f = p5.Vector.div(force, this.mass);
        this.acceleration.add(f);
    }

    update() {
        this.vel.add(this.acceleration);
        this.pos.add(this.vel);
        this.vel.limit(15);
        this.acceleration.mult(0); 
    }

    display() {
        stroke(0);
        strokeWeight(2);
        fill(127, 127);
        image(playerImage, this.pos.x, this.pos.y, this.width, this.height);
        if (flames) {
            push();
                stroke(255, 100, 0);
                angleMode(DEGREES);
                let r = 50;
                translate(this.pos.x + (this.width/2), this.pos.y + this.height);
                rotate(67.5);
                for (let i = 0; i < 45; i++) {
                    push();
                        rotate(i);
                        line(0, 0, 50, 0);
                    pop();
                }
            pop();
        }
    }

    checkEdges() {
        if (this.pos.x > width - this.width) {
            this.pos.x = width - this.width;
            this.vel.x *= -1;
        }
        else if (this.pos.x < 0) {
            this.vel.x *= -1;
            this.pos.x = 0;
        }
        if (this.pos.y > height - this.height) {
            this.vel.y *= -1;
            this.pos.y = height - this.height;
        }
        else if (this.pos.y < 0) {
            this.vel.y *= -1;
            this.pos.y = 0;
        }
    }
}