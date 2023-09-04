//import express 和 ws 套件
const express = require('express')

require('./ws')

const PORT = 3000 //指定 port

const app = express()

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

//創建 express 物件，綁定監聽  port , 設定開啟後在 console 中提示
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
})

