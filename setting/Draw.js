const probablity = () => {
    return Math.random() * 100
}

const createBrick = (x, y, width, height, maxHealth) => {
    const chance = probablity()
    let item
    if(chance < 30) item = '🔥'
    if(chance < 20) item = '❤️'
    if(chance < 10) item = '🥑'

    const brick = {
        x,
        y,
        width,
        height,
        health: maxHealth,
        maxHealth,
        item: item
    };
    return brick;
}

const drawWall = (wall, ctx) => {
    const { thick, width, height } = wall;
    ctx.fillStyle = '#2f2f2f';
    ctx.fillRect(0, 0, width, height);
}

const drawBall = (ball, ctx) => {
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.closePath();
}

const moveBall = (ball, wall) => {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x > wall.width - ball.radius || ball.x < ball.radius) {
        ball.dx = -ball.dx;
    }

    if (ball.y > wall.height - ball.radius || ball.y < ball.radius) {
        ball.dy = -ball.dy;
    }
}

const drawBricks = (bricks, ctx) => {
    bricks.forEach(brick => {
        ctx.fillStyle = '#b22222'
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
        ctx.fillStyle = 'red'
        ctx.fillRect(brick.x, brick.y, brick.width * brick.health / brick.maxHealth , brick.height / 5)
        ctx.strokeStyle = 'blue'
        ctx.strokeRect(brick.x, brick.y, brick.width, brick.height)
        if(brick.item){
            ctx.strokeText(brick.item, brick.x+ 15, brick.y + 15, brick.width, brick.height)
        }
    })
}

const checkCollision = (ball, brick) => {
    return (
        ball.x + ball.radius > brick.x &&
        ball.x - ball.radius < brick.x + brick.width &&
        ball.y + ball.radius > brick.y &&
        ball.y - ball.radius < brick.y + brick.height
    )
}

export { drawWall, drawBall, moveBall, drawBricks, checkCollision, createBrick }