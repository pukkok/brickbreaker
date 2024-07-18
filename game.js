const root = document.getElementById('root')
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const expBar = document.querySelector('.exp-bar')
const infoBox = document.querySelector('.info-box')
const setBox = document.querySelector('.set-box')
const playBtn = setBox.querySelector('.stop')
const settingBtn = setBox.querySelector('.setting')
const userUl = setBox.querySelector('.user-ul')
const logoutBtn = userUl.querySelector('.logout')
const saveBtn = userUl.querySelector('.save')
const ballBox = document.querySelector('.ball-box')


const axios = window.axios
import { userBall, yellowBall, blueBall, greenBall} from './setting/balls.js'
import bricks from './setting/block.js'
import { needExp } from './setting/base.js'
import { drawWall, drawBall, moveBall, drawBricks, checkCollision, createBrick } from './setting/Draw.js';

canvas.width = window.innerWidth > 720 ? 720 : window.innerWidth;
canvas.height = canvas.width * 1.5;

const token = JSON.parse(localStorage.getItem('token'))

let wall = {
    thick: 4,
    width: canvas.width,
    height: canvas.height,
}
let pause
let userInfo = {
    userId: '',
    exp : 0,
    level : 1,
    gold : 0
}
let balls = [];
const ballColors = ['green', 'blue', 'yellow']
let selectedBricks = bricks[Math.floor(Math.random()*bricks.length)] // 벽돌 맵
// let selectedBricks = bricks[2] // 벽돌 맵

async function loadData () {
    if(token){
        const {data} = await axios.post('/game/data', {}, {
            headers : {'Authorization' : `Bearer ${token}`}
        })
        if(data.code === 200){
            const {exp, gold, level, userId} = data
            userInfo = { ...userInfo, exp, gold, level, userId }
            // userBall = {... userBall, damage : 1 * level}
        }
    }else{
        console.log('로그인 먼저 하기')
    }
    starter()
}
loadData()

function getRandomPosition (radius, wallWidth, wallHeight) {
    const x = radius + 10 + Math.random() * (wallWidth - 2 * radius - 20);
    const y = radius + 10 + Math.random() * (wallHeight - 2 * radius - 20);
    return { x, y };
}

selectedBricks = selectedBricks.map(brick => {
    const { x, y, width, height, maxHealth } = brick
    return createBrick(x, y, width, height, maxHealth)
})

function firstGetBall () {
    const {x, y} = getRandomPosition(userBall.radius, wall.width, wall.height)
    balls.push({ ...userBall, x, y })
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawWall(wall, ctx)
    drawBricks(selectedBricks, ctx)
    
    balls.forEach(ball => {
        moveBall(ball, wall);
        drawBall(ball, ctx);

        // 벽돌과 충돌 체크
        selectedBricks = selectedBricks.filter(brick => {
            if (checkCollision(ball, brick)) {
                brick.health -= ball.damage; // 벽돌 체력 감소
                ball.dx = -ball.dx
                ball.dy = -ball.dy
                if(brick.health === 0){
                    userInfo.exp += 1
                    getExp()
                }

                return brick.health > 0 // 체력이 0 이하인 벽돌은 제거
            }
            return true
        })
    })

    if(selectedBricks.length === 0){
        selectedBricks = bricks[Math.floor(Math.random()*bricks.length)].map(brick => {
            const { x, y, width, height, maxHealth } = brick
            return createBrick(x, y, width, height, maxHealth)
        })
    }

    pause = requestAnimationFrame(draw)
}

// 경험치 바
function getExp () {
    expBar.innerHTML=''

    if(userInfo.exp / needExp[userInfo.level-1] === 1){ // 레벨업
        userInfo = {...userInfo, level : userInfo.level + 1, exp: 0}
        // ballSpeedUp(userBall)
    }
    const expText = document.createElement('span')
    expText.innerText = `${userInfo.exp} / ${needExp[userInfo.level-1]}`
    const currentExp = document.createElement('div')
    currentExp.className = 'current-exp'
    currentExp.style.width = `${expBar.offsetWidth * (userInfo.exp / needExp[userInfo.level-1])}px`

    initInfo()
    expBar.append(currentExp, expText)
}

// 플레이어 정보
function initInfo () {
    infoBox.innerHTML = ''
    const info_h1 = document.createElement('h1')
    info_h1.innerHTML = `플레이어 정보 <span>(${userInfo.userId ? userInfo.userId : '비회원'})</span>`
    const playerInfo = document.createElement('div')
    playerInfo.className = 'info'
    const levelText = document.createElement('p')
    levelText.innerText = `레벨 : ${userInfo.level}`
    playerInfo.append(levelText)
    infoBox.append(info_h1, playerInfo)
}



const addBall = (ball) => {
    console.log('동작')
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
    if (ballColor === 'blue') blueBall.dx += 0.5; blueBall.dy += 0.5;
    if (ballColor === 'green') greenBall.dx += 0.5; greenBall.dy += 0.5;
    if (ballColor === 'yellow') yellowBall.dx += 0.5; yellowBall.dy += 0.5;
    balls = balls.filter(ball => {
        if(ball.color === ballColor){
            ball.dx = (ball.dx / Math.abs(ball.dx)) * (Math.abs(ball.dx) + 0.5)
            ball.dy = (ball.dy / Math.abs(ball.dy)) * (Math.abs(ball.dy) + 0.5)
        }
        return ball
    })
}

function ballMaker () {
    ballColors.forEach(color => {
        const box = document.createElement('div')
        const div = document.createElement('div')
        div.className = `${color} btn-box`
        const addBtn = document.createElement('button')
        addBtn.dataset.type = 'add'
        addBtn.innerText = '추가'
        const speedBtn = document.createElement('button')
        speedBtn.dataset.type = 'speed'
        speedBtn.innerText = '속도 증가'
        const deleteBtn = document.createElement('button')
        deleteBtn.dataset.type = 'delete'
        deleteBtn.innerText = '삭제'
        div.append(addBtn, speedBtn, deleteBtn)
        box.append(color, div)
        ballBox.append(box)
    })

    const ballBtns = document.querySelectorAll('.ball-box button')
    ballBtns.forEach(btn => {
        let selectedball
        switch(btn.parentElement.classList[0]){
            case 'green' : selectedball = greenBall
            break
            case 'blue' : selectedball = blueBall
            break
            case 'yellow' : selectedball = yellowBall
            break
        }

        if(btn.dataset.type === 'add'){
            btn.addEventListener('click', () => {
                addBall(selectedball)
            })
        }
        if(btn.dataset.type === 'speed'){
            btn.addEventListener('click', () => {
                ballSpeedUp(btn.parentElement.classList[0])
            })
        }
        if(btn.dataset.type === 'delete'){
            btn.addEventListener('click', () => {
                deleteBall(btn.parentElement.classList[0])
            })
        }
    })
}





// 플레이버튼
playBtn.addEventListener('click', () => {
    if(playBtn.classList.contains('stop')){
        cancelAnimationFrame(pause)
        playBtn.className = 'play'
    }else{
        draw()
        playBtn.className = 'stop'
    }
})
// 로그아웃 버튼
logoutBtn.addEventListener('click', () => {
    if(token){
        localStorage.clear()
        alert('로그아웃 되었습니다.')
        window.location.reload()
    }else{
        alert('로그아웃 불가능')
    }
})
// 저장버튼
saveBtn.addEventListener('click', async () => {
    const {data} = await axios.post('/game/save', {
        userInfo
    }, {headers : {'Authorization' : `Bearer ${token}`}})
    alert(data.msg)
})
// 설정 버튼
settingBtn.addEventListener('click', () => {
    userUl.classList.toggle('on')
})

function starter() {
    firstGetBall()
    draw()
    initInfo()
    getExp()
    ballMaker()
}