// 로그인 페이지
const root = document.getElementById('root')
const axios = window.axios

const outSide = document.createElement('section')
outSide.className = 'outside-part'
const box = document.createElement('div')
box.className = 'box'
const title = document.createElement('h1')
title.innerText = '공키우기 RPG'

const loginForm = document.createElement('form')
loginForm.className = 'login-form'
const idInput = document.createElement('input')
const pwInput = document.createElement('input')
pwInput.type = 'password'
const loginBtn = document.createElement('button')
loginBtn.innerText = '로그인'
loginForm.append(idInput, pwInput, loginBtn)

const footer = document.createElement('p')
footer.className = 'footer'
const br = document.createElement('br')
const join = document.createElement('button')
join.innerText = '회원가입'
const find = document.createElement('button')
find.innerText = '아이디/비밀번호 찾기'
footer.append('개인정보 없이 30초만에!', br, join, ' | ', find)

function loginPage(){
    outSide.innerHTML = ''
    box.innerHTML = ''
    if(box.classList.contains('join')){
        box.classList.remove('join')
    }
    box.append(title, loginForm, footer)
    outSide.append(box)
    root.append(outSide)
}
loginPage()

loginBtn.addEventListener('click', async (e) => {
    e.preventDefault()
    const {data} = await axios.post('/user/login', {
        userId : idInput.value, password: pwInput.value
    })
    if(data.code === 200){
        alert('로그인 되었습니다.')
        localStorage.setItem('token', JSON.stringify(data.token))
        window.location.href = '/index.html'

    }else{
        alert(data.msg)
    }
})

const joins = [
    {className: 'nick-name', text : '닉네임', type: 'text', name: 'nickName', placeholder: '닉네임'},
    {className: 'id-label', text : '아이디', type: 'text', name: 'userId', placeholder: '한글 안됩니다'},
    {className: 'pw-label', text : '비밀번호', type: 'password', name: 'password', placeholder: '영문, 숫자, 특수문자 조합'},
    {className: 'cf-pw-label', text : '비밀번호 확인', type: 'password', name: 'confirmPassword', placeholder: '한번 더 입력'}
]

// 회원가입
join.addEventListener('click', () => {
    outSide.innerHTML = ''
    box.innerHTML = ''
    box.classList.add('join')
    title.innerText = '회원가입'
    
    const joinForm = document.createElement('form')
    joins.forEach(item => {
        const label = document.createElement('label')
        label.className = item.className
        const span = document.createElement('span') 
        span.innerText = item.text
        const input = document.createElement('input')
        input.type = item.type
        input.name = item.name
        input.placeholder = item.placeholder
        label.append(span, input)
        joinForm.append(label)
    })
    const sendBtn = document.createElement('button')
    sendBtn.innerText = '완료'
    box.append(title, joinForm, sendBtn)
    outSide.append(box)

    sendBtn.addEventListener('click', async () => {
        const inputs = document.querySelectorAll('.box.join input')
        let valueObj = {}
        Array.from(inputs).forEach(input => {
            return valueObj[input.name] = input.value
        })

        const {data} = await axios.post('/user/join', {
            ...valueObj    
        })
        alert(data.msg)
        if(data.code === 200){
            return loginPage()
        }
    })
})