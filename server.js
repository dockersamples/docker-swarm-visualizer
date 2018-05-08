var url = require('url')
var fs = require('fs');
var express = require('express');
var _  = require('lodash');
var superagent = require('superagent');
var net = require('net');
var http = require('http');
var https = require('https');
var WS = require('ws');

var WebSocketServer = WS.Server;
var indexData;
var app = express();
var ms = process.env.MS || 5000;
process.env.MS=ms

var ctxRoot = process.env.CTX_ROOT || '/';

if ( !ctxRoot.startsWith('/') ) {
    ctxRoot = '/' + ctxRoot;
}

if ( !ctxRoot.endsWith('/') ) {
    ctxRoot = ctxRoot + '/';
}

app.use(ctxRoot, express.static('dist'));

var server = app.listen(8080, function () {
    indexData = _.template(fs.readFileSync('index.tpl'))(process.env);
});

app.get(ctxRoot, function(req, res) {
    res.send(indexData);
});

if (process.env.DOCKER_HOST) {
    console.log("Docker Host: " + process.env.DOCKER_HOST)

    try {
        dh = process.env.DOCKER_HOST.split(":");
        var docker_host = dh[0];
        var docker_port = dh[1];
    } catch (err) {
        console.log(err.stack)
    }
}

var cert_path;
if (process.env.DOCKER_TLS_VERIFY) {
    if (process.env.DOCKER_CERT_PATH) {
        cert_path = process.env.DOCKER_CERT_PATH;
    } else {
        cert_path = (process.env.HOME || process.env.USERPROFILE) + "/.docker"
    }
}

var wss = new WebSocketServer({server: server});

app.get(ctxRoot + 'apis/*', function(req, response) {
    var path = req.params[0];
    var jsonData={};
    var options = {
        path: ('/' + path),
        method: 'GET'
    }

    var request = http.request;

    if (cert_path) {
        request = https.request;
        options.ca = fs.readFileSync(cert_path + '/ca.pem');
        options.cert = fs.readFileSync(cert_path + '/cert.pem');
        options.key = fs.readFileSync(cert_path + '/key.pem');
    }

    if (docker_host) {
        options.host = docker_host;
        options.port = docker_port;
    } else if (process.platform === 'win32') {
        options.socketPath = '\\\\.\\pipe\\docker_engine';
    } else {
        options.socketPath = '/var/run/docker.sock';
    }

    var req = request(options, (res) => {
        var data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            jsonData['objects'] = JSON.parse(data.toString());
            response.json(jsonData);
        });
    });
    req.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
        console.log(e.stack);
    });
    req.end();
});
