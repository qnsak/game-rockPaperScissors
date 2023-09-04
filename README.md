// module1.js
var express = require('express');
var expressWs = require('express-ws');

var router = express.Router();
expressWs(router);

router
  .ws('/user', function (ws, req){
      ws.on('message', function (msg) {
          // 业务代码
          ...
      })
   })
  .get('/user', function(req, resp) {
  })
  .post('/user', function(req, resp) {
  })
  ...

module.exports = router;
