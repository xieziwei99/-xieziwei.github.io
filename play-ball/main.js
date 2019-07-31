// 设定画布
const canvas = document.querySelector('canvas');
// 返回canvas 的上下文，直接代指画布上的一块允许我们绘制 2D 图形的区域。
const ctx = canvas.getContext('2d');
const myPara = document.querySelector('p');

// 设定画布长宽，让画布的宽高设置为浏览器的宽高，并赋值给变量 width 和 height
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// 生成随机数的函数，包含 min 和 max
function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// 生成随机颜色的函数
function randomColor() {
    return 'rgb(' +
        random(0, 255) + ', ' +
        random(0, 255) + ', ' +
        random(0, 255) + ')';
}

class Shape {
    constructor(x, y, velX, velY, exists) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.exists = exists;
    }
}

class Ball extends Shape {
    constructor(x, y, velX, velY, color, size, exists) {
        super(x, y, velX, velY, exists);
        this.color = color;
        this.size = size;
    }
}

Ball.prototype.draw = function () {
    ctx.beginPath();    // 声明我们现在要开始在纸上画一个图形了
    ctx.fillStyle = this.color; // 定义这个图形的颜色
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);   // 画弧，角度单位以弧度表示
    ctx.fill(); // 声明我们结束了以 beginPath() 开始的绘画，并且使用我们之前设置的颜色进行填充
};

Ball.prototype.update = function () {
    if ((this.x + this.size >= width) || (this.x - this.size <= 0)) {
        this.velX = -(this.velX);
    }
    if ((this.y + this.size >= height) || (this.y - this.size <= 0)) {
        this.velY = -(this.velY);
    }
    this.x += this.velX;
    this.y += this.velY;
};

Ball.prototype.collisionDetect = function () {
    for (let i = 0; i < balls.length; i++) {
        if (!(this === balls[i])) {     // 不希望检测到一个小球撞到了自己
            let dx = this.x - balls[i].x;
            let dy = this.y - balls[i].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance <= this.size + balls[i].size) {
                balls[i].color = this.color = randomColor();
            }
        }
    }
};

class EvilCircle extends Shape{
    constructor(x, y, exists) {
        super(x, y, 20, 20, exists);
        this.color = 'white';
        this.size = 10;
    }
}

EvilCircle.prototype.draw = function () {
    ctx.beginPath();
    ctx.lineWidth = 3;  // 让这个圈更厚一点
    ctx.strokeStyle = this.color;   // stroke-空心的，fill-实心的
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
};

EvilCircle.prototype.checkBounds = function () {
    if ((this.x + this.size >= width) || (this.x - this.size <= 0)) {
        this.x = width / 2;
    }
    if ((this.y + this.size >= height) || (this.y - this.size <= 0)) {
        this.y = height / 2;
    }
};

EvilCircle.prototype.setControls = function () {
    window.onkeydown = (e) => {
        // KeyboardEvent.key 返回用户按下的物理按键的值
        switch (e.key) {
            case 'a':
                this.x -= this.velX;
                break;
            case 'd':
                this.x += this.velX;
                break;
            case 'w':
                this.y -= this.velY;
                break;
            case 's':
                this.y += this.velY;
                break;
        }
    }
};

EvilCircle.prototype.collisionDetect = function () {
    for (let i = 0; i < balls.length; i++) {
        if (balls[i].exists) {  // 小球仍存在
            let dx = this.x - balls[i].x;
            let dy = this.y - balls[i].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance <= this.size + balls[i].size) {
                balls[i].exists = false;
            }
        }
    }
};

let balls = [];
while (balls.length < 25) {
    let ball = new Ball(random(0, width), random(0, height), random(-7, 7), random(-7, 7),
        randomColor(), random(10, 20), true);
    balls.push(ball);
}

let evilCircle = new EvilCircle(random(0, width), random(0, width), true);
evilCircle.setControls();

function loop() {
    // 半透明的黑色
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';  // TODO: 不用beginPath()?
    // 画出一个填充满整个画布的矩形，这是在下一个视图画出来时用来遮住之前的视图的。
    // 如果不这样做得话，你就会在屏幕上看到一条蛇的形状而不是小球的运动了。
    // 半透明的rgba(0,0,0,0.25)，也就是让之前的视图留下来一点点，从而你可以看到小球运动时的轨迹。
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < balls.length; i++) {
        if (balls[i].exists) {
            balls[i].draw();
            balls[i].update();
            balls[i].collisionDetect();
        } else {
            balls.splice(i, 1); // 删除第i个元素
        }
    }

    myPara.textContent = '还剩多少个球：' + balls.length;
    evilCircle.draw();
    evilCircle.checkBounds();
    evilCircle.collisionDetect();

    // 使用 requestAnimationFrame() 方法再运行一次函数
    // 当一个函数正在运行时传递相同的函数名，从而每隔一小段时间都会运行一次这个函数，
    // 这样我们可以得到一个平滑的动画效果。这主要是通过递归完成的。
    requestAnimationFrame(loop);
}

loop();
