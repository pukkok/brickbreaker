const randomDirection = () => {
    return Math.random() < 0.5 ? -1 : 1; // 방향을 랜덤으로 결정 (왼쪽/오른쪽, 위/아래)
}

let userBall = {
    color: 'white',
    radius: 10,
    dx: 1 * randomDirection(),
    dy: 1 * randomDirection(),
    damage : 1,
    counts: 1
}

let whiteBall = {
    color: 'white',
    radius: 5,
    dx: 1 * randomDirection(),
    dy: 1 * randomDirection(),
    damage: 1,
    counts : 1
}

let blueBall = {
    color: 'blue',
    radius: 5,
    dx: 1 * randomDirection(),
    dy: 1 * randomDirection(),
    damage: 2,
    counts: 0
}

let greenBall = {
    color: 'green',
    radius: 5,
    dx: 1 * randomDirection(),
    dy: 1 * randomDirection(),
    damage: 2,
    counts: 0
}

export { userBall, whiteBall, blueBall, greenBall }