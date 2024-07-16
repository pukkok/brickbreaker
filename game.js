const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth > 720 ? 720 : window.innerWidth;
canvas.height = window.innerHeight;

import {whiteBall, blueBall, greenBall} from './balls.js'
import bricks from './block.js'

const getRandomPosition = (radius, wallWidth, wallHeight) => {
    const x = radius + 10 + Math.random() * (wallWidth - 2 * radius - 20);
    const y = radius + 10 + Math.random() * (wallHeight - 2 * radius - 20);
    return { x, y };
}

let wall = {
    thick: 4,
    width: canvas.width,
    height: canvas.height,
}
let pause
let stage = 1;


const drawWall = () => {
    const { thick, width, height } = wall;
    // 벽
    ctx.fillStyle = '#2f2f2f';
    // ctx.strokeRect(thick, thick, )
    ctx.fillRect(0, 0, width, height);
};

const drawBall = (ball) => {
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.closePath();
};

const moveBall = (ball) => {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x > wall.width - ball.radius || ball.x < ball.radius) {
        ball.dx = -ball.dx;
    }

    if (ball.y > wall.height - ball.radius || ball.y < ball.radius) {
        ball.dy = -ball.dy;
    }
}

let selectedBricks = bricks[0]

const drawBricks = () => {
    selectedBricks.forEach(brick => {
        ctx.fillStyle = '#b22222'
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
        ctx.fillStyle = 'red'
        ctx.fillRect(brick.x, brick.y, brick.width * brick.health / brick.maxHealth , brick.height / 5)
        ctx.strokeStyle = 'blue'
        ctx.strokeRect(brick.x, brick.y, brick.width, brick.height)
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

let balls = [];

function firstGetBall () {
    const {x, y} = getRandomPosition(whiteBall.radius, wall.width, wall.height);
    balls.push({ ...whiteBall, x, y });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWall()
    drawBricks()
    
    balls.forEach(ball => {
        moveBall(ball);
        drawBall(ball);

        // 벽돌과 충돌 체크
        selectedBricks = selectedBricks.filter(brick => {
            if (checkCollision(ball, brick)) {
                brick.health -= ball.damage; // 벽돌 체력 감소
                ball.dx = -ball.dx;
                ball.dy = -ball.dy;
                return brick.health > 0; // 체력이 0 이하인 벽돌은 제거
            }
            return true;
        })
    })

    // if(selectedBricks.length === 0){
    //     for (let i = 0; i < brickCount; i++) {
    //         selectedBricks.push(createBrick());
    //     }
    //     stage++
    //     initOption()
    // }

    pause = requestAnimationFrame(draw);
}

const addBall = (ball) => {
    const {x, y} = getRandomPosition(ball.radius, wall.width, wall.height)
    balls.push({ ...ball, x, y })
}

const deleteBall = (deleteBallColor) => {
    let isDelete = false
    balls = balls.filter(ball => {
        if(!isDelete && ball.color === deleteBallColor){
            isDelete = true
            return
        }
        return ball
    })
    return isDelete
}

const ballSpeedUp = (ballColor) => {
    if (ballColor === 'white') whiteBall.dx += 0.5; whiteBall.dy += 0.5;
    balls = balls.filter(ball => {
        if(ball.color === ballColor){
            ball.dx = (ball.dx / Math.abs(ball.dx)) * (Math.abs(ball.dx) + 0.5)
            ball.dy = (ball.dy / Math.abs(ball.dy)) * (Math.abs(ball.dy) + 0.5)
        }
        return ball
    })
}

const playBtn = document.querySelector('.play-btn-box button')
playBtn.addEventListener('click', () => {
    if(playBtn.className === 'stop'){
        cancelAnimationFrame(pause)
        playBtn.className = 'play'
    }else{
        draw()
        playBtn.className = 'stop'
    }
})


const btns = document.querySelectorAll('.control-box .btn-box button')
btns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
        let ball = ''
        switch(btn.className){
            case 'white' : ball = whiteBall
            break
            case 'blue' : ball = blueBall
            break
            case 'green' : ball = greenBall
            break
        }

    if(btn.dataset.type === 'add'){
        addBall(ball)
        ball.counts++
    }
    if(btn.dataset.type === 'delete'){
        const success = deleteBall(btn.className)
        if(success) ball.counts--
    }
    if(btn.dataset.type === 'speed'){
        ballSpeedUp(btn.className)
    }

    initOption()
    })
})

const optionBox = document.querySelector('.option-box')

function initOption () {
    optionBox.innerHTML = ''
    const h2 = document.createElement('h2')
    h2.innerText = `스테이지 : ${stage}`
    const span1 = document.createElement('span')
    span1.innerText = `기본공 : ${whiteBall.counts}`
    const span2 = document.createElement('span')
    span2.innerText = `파란공 : ${blueBall.counts}`
    const span3 = document.createElement('span')
    span3.innerText = `녹색공 : ${greenBall.counts}`
    const spanAll = document.createElement('span')
    spanAll.innerText = `총 개수 : ${whiteBall.counts + blueBall.counts + greenBall.counts}`
    optionBox.append(h2, span1, span2, span3, spanAll)
}

document.addEventListener('DOMContentLoaded', () => {
    firstGetBall()
    draw()
    initOption()
});