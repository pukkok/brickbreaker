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

    // initOption()
    })
})