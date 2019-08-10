// 创建所需的常量
const rememberDiv = document.querySelector('.remember');
const forgetDiv = document.querySelector('.forget');
const form = document.querySelector('form');
const nameInput = document.querySelector('#entername');
const submitBtn = document.querySelector('#submitname');
const forgetBtn = document.querySelector('#forgetname');

const h1 = document.querySelector('h1');
const personalGreeting = document.querySelector('.personal-greeting');

document.body.onload = nameDisplayCheck;

// 当提交按钮按下时阻止表单提交
form.addEventListener('submit', e => {
    e.preventDefault();
});

submitBtn.addEventListener('click', () => {
    localStorage.setItem('name', nameInput.value);
    nameDisplayCheck();
});

forgetBtn.addEventListener('click', () => {
    localStorage.removeItem('name');
    nameDisplayCheck();
});

function nameDisplayCheck() {
    if (localStorage.getItem('name')) {
        let name = localStorage.getItem('name');
        h1.textContent = 'Welcome, ' + name;
        personalGreeting.textContent = `Welcome to our website ${name}! I hope you can find some fun here.`;
        rememberDiv.style.display = 'none';
        forgetDiv.style.display = 'block';
    } else {
        h1.textContent = 'Welcome!';
        personalGreeting.textContent = `Welcome to our website! I hope you can find some fun here.`;
        rememberDiv.style.display = 'block';
        forgetDiv.style.display = 'none';
    }
}