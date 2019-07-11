let myImage = document.querySelector('img');

myImage.onclick = function() {
    let mySrc = myImage.getAttribute('src');
    if (mySrc === 'images/bupt.jpg') {
        myImage.setAttribute('src', 'images/wlh.jpg');
    } else {
        myImage.setAttribute('src', 'images/bupt.jpg');
    }
}

function setHeading(name) {
    let myHeading = document.querySelector('h1');
    myHeading.textContent = `北邮贼棒，${name}!`;
}

function setUserName() {
    let name = prompt('请输入你的名字：');
    localStorage.setItem('name', name);
    setHeading(name);
}

let storedName = localStorage.getItem('name');
if (!storedName) {
    setUserName();
} else {
    setHeading(storedName);
}

let myButton = document.querySelector('button');
myButton.onclick = setUserName;