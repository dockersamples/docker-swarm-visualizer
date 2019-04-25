require('dotenv').config();
var url = require("url");
var fs = require("fs");
var jwt = require("jsonwebtoken");
var express = require("express");
var _ = require("lodash");
var superagent = require("superagent");
var net = require("net");
var http = require("http");
var https = require("https");
var WS = require("ws");
var bodyParser = require("body-parser");
var WebSocketServer = WS.Server;
var indexData;
var app = express();
var ms = process.env.MS || 5000;
var secret = "wingardiumleviosaxx123";
var express_session = require("express-session");
var User = require("./src/controller/user");
process.env.MS = ms;
var REMOVE_SENSITIVE_CONTENT = process.env.REMOVE_SENSITIVE_CONTENT || false;
var ctxRoot = process.env.CTX_ROOT || "/";
var getCtxRoot = require('./src/ctxRootHelper');
ctxRoot = getCtxRoot(ctxRoot);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(ctxRoot, express.static("dist"));

app.set("view engine", "ejs");
app.set("views", "./src/views");

app.use(
    express_session({
        secret: secret,
        resave: false,
        saveUninitialized: false,
        cookie: { httpOnly: true },
        maxAge: 60
    })
);

var server = app.listen(8080, function () {
    indexData = _.template(fs.readFileSync("index.tpl"))(process.env);
});

app.get(ctxRoot, async (req, res) => {
    if (await User.authenticated(req)) {
        res.send(indexData);
    } else {
        res.redirect(ctxRoot+"auth");
    }
});

if (process.env.DOCKER_HOST) {
    console.log("Docker Host: " + process.env.DOCKER_HOST);

    try {
        dh = process.env.DOCKER_HOST.split(":");
        var docker_host = dh[0];
        var docker_port = dh[1];
    } catch (err) {
        console.log(err.stack);
    }
}

var cert_path;
if (process.env.DOCKER_TLS_VERIFY) {
    if (process.env.DOCKER_CERT_PATH) {
        cert_path = process.env.DOCKER_CERT_PATH;
    } else {
        cert_path = (process.env.HOME || process.env.USERPROFILE) + "/.docker";
    }
}

var wss = new WebSocketServer({
    server: server
});

app.get(ctxRoot + "apis/*", async (req, response) => {
    var path = req.params[0];
        if (await User.authenticated(req, 'api'+path)) {
        var jsonData = {};
        var options = {
            path: "/" + path,
            method: "GET"
        };

        var request = http.request;

        if (cert_path) {
            request = https.request;
            options.ca = fs.readFileSync(cert_path + "/ca.pem");
            options.cert = fs.readFileSync(cert_path + "/cert.pem");
            options.key = fs.readFileSync(cert_path + "/key.pem");
        }

        if (docker_host) {
            options.host = docker_host;
            options.port = docker_port;
        } else if (process.platform === "win32") {
            options.socketPath = "\\\\.\\pipe\\docker_engine";
        } else {
            options.socketPath = "/var/run/docker.sock";
        }

        var req = request(options, res => {
            var data = "";
            res.on("data", chunk => {
                data += chunk;
            });
            res.on("end", () => {
                jsonData["objects"] = JSON.parse(data.toString());
                if (path === "services" || path === "tasks" && REMOVE_SENSITIVE_CONTENT) {
                    // Bellow sensitives data will be deleted from response, removing: Env ans Args.
                    jsonData.objects.map(content => {
                        if (path === "services") {
                            if ( content.Spec && content.Spec.TaskTemplate && content.Spec.TaskTemplate.ContainerSpec ) {
                                if (content.Spec.TaskTemplate.ContainerSpec.Env) delete content.Spec.TaskTemplate.ContainerSpec.Env;
                                if (content.Spec.TaskTemplate.ContainerSpec.Args) delete content.Spec.TaskTemplate.ContainerSpec.Args;
                            }
                            if (
                                content.PreviousSpec && content.Spec.TaskTemplate && content.Spec.TaskTemplate.ContainerSpec ) {
                                if (content.PreviousSpec.TaskTemplate.ContainerSpec.Args) delete content.PreviousSpec.TaskTemplate.ContainerSpec.Args;
                                if (content.PreviousSpec.TaskTemplate.ContainerSpec.Env) delete content.PreviousSpec.TaskTemplate.ContainerSpec.Env;
                            }
                        } else {
                            if (content.Spec && content.Spec.ContainerSpec) {
                                if (content.Spec.ContainerSpec.Env) delete content.Spec.ContainerSpec.Env;
                                if (content.Spec.ContainerSpec.Args) delete content.Spec.ContainerSpec.Args;
                            }
                        }
                    });
                }
                response.json(jsonData);
            });
        });
        req.on("error", e => {
            console.log(`problem with request: ${e.message}`);
            console.log(e.stack);
        });
        req.end();
    } else {
        response.status(401).json({ Error: "Not Authorized" });
    }
});

app.get(ctxRoot+"auth", (req, res) => User.authPage(req, res));
app.post(ctxRoot+"auth", (req, res) => User.auth(req, res));

console.log("Docker Visualizer is Running");
console.log(`Username: ${User.defaultUsername}, Password: ${User.defaultPassword}`);
console.log(`Asking for credentials: ${process.env.ASK_CREDENTIALS || false }`);