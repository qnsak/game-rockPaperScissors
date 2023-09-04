const WebSocketServer = require('ws').Server
const uuid = require('uuid');
const url = require('url');

const wss = new WebSocketServer({port: 3001})

const getMessega = (type, data) => {
    let messege = {
        'type': type,
        'data': data
    };
    return JSON.stringify(messege);
}

const ROOM = [];
//當有 client 連線成功時
wss.on('connection', (ws, req) => {
    ws.id = uuid.v4();
    const { query: { key } } = url.parse(req.url, true);

    ws.room = key;
    let gameIndex = ROOM.findIndex((e) => {
        return e.key == key;
    });

    if (gameIndex !== -1) {
        
        if (!ROOM[gameIndex].players.includes(ws.id)) {
            if (ROOM[gameIndex].players.length < 2) {
                ROOM[gameIndex].players.push(ws.id);
            } else {
                let message = getMessega('over', 'over');
                ws.send(message);
            }
        }
    } else {
        let game = {
            'key': key,
            'players': [ws.id]
        };
        ROOM.push(game);
        gameIndex = ROOM.length - 1;
    }
    // 當收到client消息時
    ws.on('message', data => {
        data = data.toString()
        let clients = wss.clients
        clients.forEach(client => {
            if (client.id !== ws.id && client.room == key) {
                client.send(data);
            }
        })
    })

    // 當連線關閉
    ws.on('close', () => {
        let clients = wss.clients
        clients.forEach(client => {
            if (client.id !== ws.id && client.room == key) {
                let message = getMessega('close', 'close');
                client.send(message);
            }
        })
    })
})
