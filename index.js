const os = require('os');
const http = require('http');
const request = require('request');
const Koa = require('koa');
const app = new Koa();
const server = app.listen(3000);
const io = require('socket.io')(server);
const loadsh = require('lodash');
io.on('connection', () => {
});

getIp = function () {
    const interfaces = os.networkInterfaces();
    let IPv4 = '127.0.0.1';
    for (const key in interfaces) {
        interfaces[key].forEach(function (details) {
            if (details.family === 'IPv4' && key === 'en0') {
                IPv4 = details.address;
            }
        });
    }
    return IPv4;
};

console.log(getIp());
let i = 0;

function check_is_img(url) {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null)
}

http.createServer(function (req, res) {
    let body = [];
    req.on('data', function (data) {
        body.push(data);
    });
    req.on('end', function () {
        body = Buffer.concat(body).toString();
        if (!check_is_img(req.url)) {
            i++;

            if (req.method === 'GET') {
                io.emit('send data', {
                    url: req.url,
                    method: req.method,
                    body: req.url,
                    key: i
                });
            } else {
                console.log(body, req.headers);
                const contentEncoding = loadsh.get(req, 'headers[content-encoding]');
                if (contentEncoding === 'rc4,gzip') {
                    console.log(contentEncoding);
                    return;
                }
                io.emit('send data', {
                    url: req.url,
                    method: req.method,
                    body: body,
                    key: i
                });
            }
        }
        requests(req, body, res);
    });
}).listen(8888, getIp());

requests = function (req, body, res) {
    request({
        url: req.url,
        method: req.method,
        header: req.headers,
        body: JSON.stringify(body)
    }, function (error, response, bodys) {
        if (!error && response.statusCode === 200) {
            console.log(bodys);
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(bodys);
        }
    });
};

