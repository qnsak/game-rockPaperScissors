let ws;

const init = (key) => {
    let url = `ws://localhost:3001?key=${key}`;
    ws = new WebSocket(url)
    ws.onopen = () => {
        console.log('open connection')
    }
    ws.onclose = () => {
        console.log('close connection');
    }
    ws.onmessage = (event) => {
        let data = JSON.parse(event.data);
    }
    ws.onerror = () => {
        console.log('is error');
    }

    return ws;
}

const send = (id, type, data) => {
    let messege = {
        'id': id,
        'type': type,
        'data': data
    };
    ws.send(JSON.stringify(messege));
}

const close = () => {
    ws.close();
}

export const connection = {
    'init': init,
    'send': send,
    'close': close,
};