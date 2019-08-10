// Create needed constants
const list = document.querySelector('ul');
const titleInput = document.querySelector('#title');
const bodyInput = document.querySelector('#body');
const form = document.querySelector('form');

let db;

// 在window的load事件被触发时调用
// 为了确保我们没有在应用完整加载前试图使用IndexedDB功能（如果我们不这么做，它会失败）。
window.onload = function () {
    // 创建数据库：名字-notes，版本号-1
    // 版本号很重要。如果要升级数据库（例如，通过更改表结构），则必须使用增加的版本号
    let request = window.indexedDB.open('notes', 1);

    // 数据库没有成功打开时触发
    request.onerror = () => {
        console.log('Database failed to open');
    };

    request.onsuccess = () => {
        console.log('Database opened successfully');
        
        db = request.result;    // 存储数据库对象
        displayData();
    };

    // 如果第一次设置数据库，或者使用比现有存储数据库更大的版本号打开数据库时（执行升级时），则运行此处理程序
    request.onupgradeneeded = function(e) {
        let db = e.target.result;
        // 类似于一张表（id自增长）
        let objectStore = db.createObjectStore('notes', {keyPath: 'id', autoIncrement: true});
        
        // 创建字段
        objectStore.createIndex('title', 'title', {unique: false});
        objectStore.createIndex('body', 'body', {unique: false});

        console.log('Database setup complete');
    };

    form.onsubmit = addData;
};

// e 为form.onsubmit时间
function addData(e) {
    // 停止以传统方式实际提交的表单（这将导致页面刷新并破坏体验）
    e.preventDefault();

    let newItem = {title: titleInput.value, body: bodyInput.value};
    // 打开一个事务
    let transaction = db.transaction(['notes'], 'readwrite');   // (表名，模式)
    // 获得表notes
    let objectStore = transaction.objectStore('notes');
    let request = objectStore.add(newItem);

    request.onsuccess = function () {
        titleInput.value = '';
        bodyInput.value = '';
    };

    transaction.oncomplete = function () {
        console.log('Transaction completed: database modification finished.');
        displayData();
    };

    transaction.onerror = function () {
        console.log('Transaction not opened due to error');
    };
}

function displayData() {
    // 清空列表，否则会有重复项出现
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    let objectStore = db.transaction('notes').objectStore('notes');
    // 获得用于遍历表notes的迭代器
    objectStore.openCursor().onsuccess = function (e) {
        let cursor = e.target.result;
        // 如果notes表中还有
        if (cursor) {
            let li = document.createElement('li');
            let h3 = document.createElement('h3');
            let p = document.createElement('p');
            h3.textContent = cursor.value.title;
            p.textContent = cursor.value.body;
            li.append(h3, p);
            list.appendChild(li);

            // 用li的属性值存储id，便于后面删除
            li.setAttribute('data-note-id', cursor.value.id);

            let deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            li.appendChild(deleteBtn);

            deleteBtn.onclick = deleteItem;

            // 游标加一
            cursor.continue();
        } else {
            if (!list.firstChild) {
                let li = document.createElement('li');
                li.textContent = 'No notes stored';
                list.appendChild(li);
            }
            console.log('Notes all displayed');
        }
    }
}

// e 为 deleteBtn.onclick
function deleteItem(e) {
    let noteId = Number(e.target.parentNode.getAttribute('data-note-id'));

    let transaction = db.transaction(['notes'], "readwrite");
    let objectStore = transaction.objectStore('notes');
    objectStore.delete(noteId);
    
    transaction.oncomplete = function () {
        // ul.remove(li)
        e.target.parentNode.parentNode.removeChild(e.target.parentNode);
        console.log('Note ' + noteId + ' deleted.');

        if (!list.firstChild) {
            let li = document.createElement('li');
            li.textContent = 'No notes stored';
            list.appendChild(li);
        }
    }
}