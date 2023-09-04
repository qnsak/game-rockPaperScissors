import lib from './lib/index.js'

const steps = document.getElementsByClassName('step');
const visibelSteps = () => {
    for(let step of steps) {
       step.style.visibility='hidden';
    }
}

// 設定遊戲步驟
const setGameStep = (step) => {
    visibelSteps();
    switch (step) {
        case 'init': {
            screenControl.step('init');
            document.getElementById('init').style.visibility = 'visible';
            break;
        }
        case 'match': {
            screenControl.step('match');
            document.getElementById('match_sreen').style.visibility = 'visible';
            break;
        }
        case 'ready': {
            screenControl.step('ready');
            document.getElementById('ready_sreen').style.visibility = 'visible';
            break;
        }
        case 'start': {
            screenControl.step('start');
            document.getElementById('select_sreen').style.visibility = 'visible';
            break;
        }
        case 'end': {
            readyo = false;
            readyt = false;
            let result = getResult();
            let text;
            let mSkill = getSkill(mySkill);
            let oSkill = getSkill(opponentSkill);
            if (result == 'W') {
                text = `勝利 - ${mSkill} vs ${oSkill}`;
            } else if (result == 'T') {
                text = `平手 - ${mSkill} vs ${oSkill}`;
            } else {
                text = `失敗 - ${mSkill} vs ${oSkill}`;
            }
            let data = {
                'result': result,
                'text': text,
            };
            screenControl.step('end', data);
            document.getElementById('end_sreen').style.visibility = 'visible';
            break;
        }
        default: {
            break;
        }
    }
}

// 取得技能文字
const getSkill = (skill) => {
    switch (skill) {
        case '1': {
            return '石頭';
        }
        case '2': {
            return '布';
        }
        case '3': {
            return '剪刀';
        }
        default: {
            return '未選';
        }
    }
}

// 取得結果
const getResult = () => {
    if (!mySkill) {
        return false;
    }
    if (!opponentSkill) {
        return true;
    }
    let result = lib.rockPaperScissors(parseInt(mySkill), parseInt(opponentSkill));
    
    return result;
}

// 設定連線流程
const setProcess = (type, data) => {
    switch (type) {
        case 'join': {
            lib.connection.send(id, 'certainJoin', id);
            setOpponent(data);
            setGameStep('ready')
            break;
        }
        case 'certainJoin': {
            setOpponent(data);
            setGameStep('ready')
            break;
        }
        case 'select': {
            opponentSkill = data;
            break;
        }
        case 'ready': {
            readyt = true;
            isReady();
            break;
        }
        case 'end': {
            setOpponent(null);
            setGameStep('init');
            break;
        }
        case 'over': {
            alert('人數已達上限');
            lib.connection.close();
            setOpponent(null);
            setGameStep('init');
            break;
        }
        case 'close': {
            alert('對手已下線');
            lib.connection.close();
            setOpponent(null);
            setGameStep('init');
            break;
        }
        default: {
            break;
        }
    }
}

let ws;
let key;
let mySkill = null;
let opponentSkill = null;

const id = lib.generateSecretKey(6);
const keyText = document.getElementById('key_text');
const roomKey = document.getElementById('roomKey');
const screenControl = new lib.screenControl;

// 建立遊戲
const copyBtn = document.getElementById('copyBtn');
copyBtn.addEventListener('click', function(e){
    keyText.select();
    document.execCommand("copy");
}, false);

// 遊戲初始化
const user = document.getElementById('user');
const main = () => {
    user.innerHTML = id;
    setGameStep('init');
};
main();

// 建立遊戲
const createGameBtn = document.getElementById('createGameBtn');
createGameBtn.addEventListener('click', function(e){
    key = lib.generateSecretKey(5)
    keyText.value = key
    ws = lib.connection.init(key);
    setGameStep('match');
    ws.addEventListener('message', (event) => {
        console.log('Message from server ', event.data);
        let message = JSON.parse(event.data)
        if (message.id != id) {
            setProcess(message.type, message.data)
        }
    });

}, false);

// 加入遊戲
const joinGameBtn = document.getElementById('joinGameBtn');
joinGameBtn.addEventListener('click', function(e){
    key = roomKey.value;

    if (!key) {
        return;
    }

    ws = lib.connection.init(key);

    ws.addEventListener('open', function (event) {
        lib.connection.send(id, 'join', id);
    });

    ws.addEventListener('message', (event) => {
        console.log('Message from server ', event.data);
        let message = JSON.parse(event.data)
        if (message.id != id) {
            setProcess(message.type, message.data)
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
        setGameStep('start');
        countDown();
    }
}

// 遊戲開始
let time;
let timerId;
const timer = document.getElementById('timer');
const countDown = () => {
    console.log('time')
    time = 5;
    timer.innerHTML = time;
    timerId = setInterval( () => {
        time = time - 1;
        timer.innerHTML = time;
        if (time == 0) {
            closeTimer();
            setGameStep('end');
        }
    }, 1000);
}
const closeTimer = () => {
    clearInterval(timerId);
}

// 選擇技能
const skills = document.querySelectorAll("input[type=radio][name='skill']");
skills.forEach(
    radio => radio.addEventListener('click', () => {
        let skill = radio.value;
        mySkill = skill;
        lib.connection.send(id, 'select', skill);
    })
);

// 再一次
const againBtn = document.getElementById('againBtn');
againBtn.addEventListener('click', function(e){
    readyo = true;
    lib.connection.send(id, 'ready', 'ok');
    isReady();
}, false);

// 結束遊戲
const endBtn = document.getElementById('endBtn');
endBtn.addEventListener('click', function(e){
    lib.connection.send(id, 'end', 'ok');
    lib.connection.close();
    setOpponent(null)
    setGameStep('init');
}, false);