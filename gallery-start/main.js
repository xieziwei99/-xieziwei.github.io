const displayedImage = document.querySelector('.displayed-img');
const thumbBar = document.querySelector('.thumb-bar');

const btn = document.querySelector('button');
const overlay = document.querySelector('.overlay');

/* 遍历图片并添加至缩略图区 */
for (let i = 1; i <= 5; i++) {
    const newImage = document.createElement('img');
    newImage.setAttribute('src', `images/pic${i}.jpg`);
    thumbBar.appendChild(newImage);
    newImage.addEventListener('click', (e) => {
        displayedImage.setAttribute('src', e.target.getAttribute('src'));
    });
}

/* 编写 变亮/变暗 按钮 */
btn.addEventListener('click', (e) => {
    let className = e.target.getAttribute('class');
    if (className === 'dark') {
        e.target.setAttribute('class', 'light');
        e.target.textContent = '变亮';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    } else if (className === 'light') {
        e.target.setAttribute('class', 'dark');
        e.target.textContent = '变暗';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    }
});