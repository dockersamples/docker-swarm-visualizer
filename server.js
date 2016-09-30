var url = require('url')
var fs = require('fs');
var express = require('express');
var _  = require('lodash');
var superagent = require('superagent');
var net = require('net');
var http = require('http');
var WS = require('ws');

var WebSocketServer = WS.Server;
var host =  process.env.HOST ||"localhost";
process.env.HOST=host
var port =process.env.PORT || 8080;
process.env.PORT=port;
var indexData;
var app = express();
var ms = process.env.MS || 5000;
process.env.MS=ms

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

console.log(process.env.DOCKER_HOST)

  if(process.env.DOCKER_HOST) {
     try {
	   dh = process.env.DOCKER_HOST.split(":");
	   var docker_host = dh[0]; 
	   var docker_port = dh[1];
     } 
	 catch (err) {
	   console.log(err.stack)
     }
	}
  var wss = new WebSocketServer({server: server});
  
  app.get('/apis/*', function(req, response) {
      var path = req.params[0];
      var jsonData={};
      var options = {
		  path: ('/' + path),
		  method: 'GET'
	  }

    if(docker_host) {
        options.host = docker_host;
		    options.port = docker_port;
	  }
	  else {
		    options.socketPath = '/var/run/docker.sock';
    }

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