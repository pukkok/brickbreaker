const root = document.getElementById('root')
const canvas = document.createElement('canvas');
const controlBox = document.createElement('div')
controlBox.className = 'control-box'
const ctx = canvas.getContext('2d');
const axios = window.axios
import { userBall, whiteBall, blueBall, greenBall} from './setting/balls.js'
import bricks from './setting/block.js'
import { needExp } from './setting/base.js'
import { drawWall, drawBall, moveBall, drawBricks, checkCollision, createBrick } from './setting/Draw.js';

canvas.width = window.innerWidth > 720 ? 720 : window.innerWidth;
canvas.height = window.innerHeight;

const token = JSON.parse(localStorage.getItem('token'))

let wall = {
    thick: 4,
    width: canvas.width,
    height: canvas.height,
}
let pause
let stage = 1
let userInfo = {
    exp : 0,
    level : 1,
    gold : 0
}

async function loadData () {
    if(token){
        const {data} = await axios.post('/game/data', {}, {
            headers : {'Authorization' : `Bearer ${token}`}
        })
        if(data.code === 200){
            const {exp, gold, level, userId} = data
            userInfo = { ...userInfo, exp, gold, level, userId }
            starter()
        }
    }else{
        console.log('로그인 먼저 하기')
    }
}
loadData()


const getRandomPosition = (radius, wallWidth, wallHeight) => {
    const x = radius + 10 + Math.random() * (wallWidth - 2 * radius - 20);
    const y = radius + 10 + Math.random() * (wallHeight - 2 * radius - 20);
    return { x, y };
}

let selectedBricks = bricks[0] // 벽돌 맵
selectedBricks = selectedBricks.map(brick => {
    const { x, y, width, height, maxHealth } = brick
    return createBrick(x, y, width, height, maxHealth)
})

let balls = [];
function firstGetBall () {
    const {x, y} = getRandomPosition(whiteBall.radius, wall.width, wall.height)
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

    // if(selectedBricks.length === 0){
    //     for (let i = 0; i < brickCount; i++) {
    //         selectedBricks.push(createBrick());
    //     }
    //     stage++
    //     initOption()
    // }

    pause = requestAnimationFrame(draw)
}

const expBar = document.createElement('div')
expBar.className = 'exp-bar'
const getExp = () => {
    expBar.innerHTML=''
    if(userInfo.exp / needExp[userInfo.level-1] === 1){
        userInfo = {...userInfo, level : userInfo.level + 1, exp: 0}
    }
    const expText = document.createElement('span')
    expText.innerText = `${userInfo.exp} / ${needExp[userInfo.level-1]}`
    const currentExp = document.createElement('div')
    currentExp.className = 'current-exp'
    currentExp.style.width = `${expBar.offsetWidth * (userInfo.exp / needExp[userInfo.level-1])}px`

    initInfo()
    expBar.append(currentExp, expText)
}

const infoBox = document.createElement('div')
infoBox.className = 'info-box'
const initInfo = () => {
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

// 세팅 박스
const setBox = document.createElement('div')
setBox.className = 'set-box'
const playBtn = document.createElement('button')
playBtn.className = 'stop'
playBtn.addEventListener('click', () => {
    if(playBtn.classList.contains('stop')){
        cancelAnimationFrame(pause)
        playBtn.className = 'play'
    }else{
        draw()
        playBtn.className = 'stop'
    }
})

const settingBtn = document.createElement('button')
settingBtn.className = 'setting'
settingBtn.addEventListener('click', () => {
    console.log('세팅')
})
setBox.append(playBtn, settingBtn)

const loginBox = document.createElement('div')
const loginLink = document.createElement('a')
loginLink.innerText = '로그인'
loginLink.href = './Page/login.html'
loginBox.append(loginLink)

const logout = document.createElement('div')
const logoutBtn = document.createElement('button')
logoutBtn.innerText = '로그아웃'
logoutBtn.addEventListener('click', () => {
    if(token){
        localStorage.clear()
        alert('로그아웃 되었습니다.')
        window.location.reload()
    }else{
        alert('로그아웃 불가능')
    }
})
logout.append(logoutBtn)

const saveBtn = document.createElement('button')
saveBtn.innerText = '저장하기'
saveBtn.addEventListener('click', async () => {
    const {data} = await axios.post('/game/save', {
        userInfo
    }, {headers : {'Authorization' : `Bearer ${token}`}})
    alert(data.msg)
})


root.innerHTML = ''
controlBox.append(expBar, setBox, infoBox, loginBox, logout, saveBtn)
root.append(canvas, controlBox)

firstGetBall()
function starter() {
    draw()
    initInfo()
    getExp()
}
starter()