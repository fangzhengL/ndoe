var net = require('net')    //引入网络模块
var os = require('os');  
// var bufferParser = require('buffer-parser')
// var wsParser = require('ws-parser');
getIp = function(){
        var interfaces = os.networkInterfaces();
        var IPv4 = '127.0.0.1';
        for (var key in interfaces) {
          interfaces[key].forEach(function(details){
            if (details.family == 'IPv4' && key == 'en0'  ) {
                IPv4 = details.address;
          }
        });
      }
    return IPv4;
}
// var PORT = 3000; //定义端口号
// console.log('Server is running on port ' + getIp() + PORT);
// var server = net.createServer();

// //监听连接事件
// server.on('connection', function(socket) {
//     var client = socket.remoteAddress + ':' + socket.remotePort;
//     console.info('Connected to ' + client);
    
//     console.log(socket);

//     //监听数据接收事件
//     socket.on('data', function(data) {
//         console.log(data.toString());
    
//         // socket.write('Hello Client!');
//     });

//     //监听连接断开事件
//     socket.on('end', function() {
//         console.log('Client disconnected.');
//     });
// });

// //TCP服务器开始监听特定端口
// server.listen(PORT, getIp());

var http = require('http');
var request = require('request');
var querystring = require('querystring');

console.log(getIp());
http.createServer(function (req, res){
  console.log(req.url, '我是httpurl');
  let body = [];
  req.on('data', function (data) {
    body.push(data);
  });

  req.on('end', function () {
    body = Buffer.concat(body).toString();
    requests(req, body, res);
  });
}).listen(8888, getIp());

requests = function(req, body, res){
  console.log(req.url, 'url');
  request({
    url: req.url,
    method: req.method,
    json: true,
    headers: req.headers,
    body: JSON.stringify(body)
}, function(error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body);
    res.write(JSON.stringify(body));
    res.end();
  }
});
}