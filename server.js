var url = require('url')
var fs = require('fs');
var express = require('express');
var _  = require('lodash');
var superagent = require('superagent');
var net = require('net');
var http = require('http');
var WS = require('ws');

var WebSocketServer = WS.Server;
var host = process.env.HOST;
var port;
var indexData;
var app = express();
var ms = process.env.MS;


app.use(express.static('dist'));
  
var server = app.listen(process.env.PORT || 3000, function () {
  port = server.address().port;
  process.env.HOST = host;
  process.env.PORT = port;
    indexData = _.template(fs.readFileSync('index.tpl'))(process.env);

});

app.get('/', function(req, res) {
  res.send(indexData);
});

  var wss = new WebSocketServer({server: server});
  
  app.get('/apis/*', function(req, response) {
      var path = req.params[0];
      var jsonData={};

        var options = {
        socketPath: "/var/run/docker.sock",
        path: ('/' + path),
        method: 'GET'
      };
    var req = http.request(options, (res) => {
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

// wss.on('connection',function connection(ws){
//     //   var jsonData={};
//     //   var options = {
//     //     socketPath: "/var/run/docker.sock",
//     //     path: ('/events'),
//     //     method: 'GET'
//     //   };
//     // var req = http.request(options, (res) => {
//     //   res.on('data', (chunk) => {
//     //     ws.send(chunk.toString());
//     //   });
//     //   res.on('end', () => {
//     //     ws.json(jsonData);
//     //   });
//     // });
//     // req.on('error', (e) => {
//     //   console.log(`problem with request: ${e.message}`);
//     //   console.log(e.stack);
//     // });
//     //   req.end();
//     while(true)
//     {setTimeout(function() {
//       ws.send('message');
//     }, 5000 );}
//   });
