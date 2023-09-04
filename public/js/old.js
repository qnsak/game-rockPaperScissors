import lib from "./lib/index.js"

let ws;
let key;

const id = lib.generateSecretKey(15);
const keyText = document.getElementById('keyText');
const roomKey = document.getElementById('roomKey');
let mySkill = null;
let opponentSkill = null;

const user = document.getElementById('user');
const main = () => {
    user.innerHTML = id;
};
main();

const createKeyBtn = document.getElementById('createKeyBtn');
createKeyBtn.addEventListener('click', function(e){
    setResult();
}, false);

const select = document.getElementById('select');

const playlerASkill = document.getElementById('playler_a_skill');
select.addEventListener('click', function(e){
    let radioButtons = playlerASkill.getElementsByTagName('input');
    let skill;
    for (let radio of radioButtons) {
        if (radio.checked) {
            skill = radio.value;
            break;
        }
    }
    mySkill = skill;
    lib.connection.send(id, 'select', skill);
}, false);



// 建立遊戲
const createGameBtn = document.getElementById('createGameBtn');
createGameBtn.addEventListener('click', function(e){
    key = lib.generateSecretKey(5)
    keyText.textContent = key
    ws = lib.connection.init(key);

    ws.addEventListener("message", (event) => {
        console.log("Message from server ", event.data);
        let message = JSON.parse(event.data)
        if (message.id != id) {
            process(message.type, message.data)
        }
    });

}, false);

// 加入遊戲
const joinGameBtn = document.getElementById('joinGameBtn');
joinGameBtn.addEventListener('click', function(e){
    key = roomKey.value;
    ws = lib.connection.init(key);
    ws.addEventListener("open", function (event) {
        lib.connection.send(id, 'join', id);
    });
    ws.addEventListener("message", (event) => {
        console.log("Message from server ", event.data);
        let message = JSON.parse(event.data)
        if (message.id != id) {
            process(message.type, message.data)
        }
    });
}, false);

// 設定對手
const opponentId  = document.getElementById('opponentId');
const setOpponent = (id) => {
    opponentId.innerHTML = id;
};

// 準備遊戲
const readyGameBtn = document.getElementById('readyGameBtn');
readyGameBtn.addEventListener('click', function(e){
    readyo = true;
    lib.connection.send(id, 'ready', 'ok');
    isReady();
}, false);
let readyo;
let readyt;
const isReady = () => {
    console.log(readyo,readyt );
    if (readyo && readyt) {
        countDown();
    }
}

// 遊戲開始

let time;
let timerId;
const timer = document.getElementById('timer');
const countDown = () => {
    time = 15;
    timer.innerHTML = time;
    timerId = setInterval( () => {
        time = time - 1;
        timer.innerHTML = time;
        if (time == 0) {
            closeTimer();
        }
    }, 1000);
}
const closeTimer = () => {
    clearInterval(timerId);
}

const setResult = () => {
    if (!mySkill) {
        console.log('i give up');
        return;
    }
    if (!opponentSkill) {
        console.log('you give up');
        return;
    }
    let result = lib.rockPaperScissors(parseInt(mySkill), parseInt(opponentSkill));
    console.log(result);
}


const playlerBSkill = document.getElementById('playler_b_skill');

const process = (type, data) => {
    switch (type) {
        case 'join': {
            console.log(id)
            lib.connection.send(id, 'certainJoin', id);
            setOpponent(data);
            break;
        }
        case 'certainJoin': {
            console.log(1)
            setOpponent(data);
            break;
        }
        case 'skill': {
            let radioButtons = document.getElementsByName('skill');
            for (let radio of radioButtons) {
                if (radio.checked) {
                    console.log(radio.value);
                    break;
                }
            }
            break;
        }
        case 'select': {
            let radioButtons = playlerBSkill.getElementsByTagName('input');
            for (let radio of radioButtons) {
                if (radio.value == data) {
                    opponentSkill = radio.value;
                    radio.checked = true;
                    break;
                }
            }
            break;
        }
        case 'ready': {
            readyt = true;
            isReady();
            break;
        }
        default: {
            break;
        }
    }
}