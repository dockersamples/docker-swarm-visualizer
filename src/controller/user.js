const jwt = require('jsonwebtoken');
const secret = 'wingardiumleviosaxx123'
const pkg = require('../../package.json');

class User { 

    constructor() {
        this.defaultUsername = process.env.DEFAULT_USERNAME || 'visualizer';
        this.defaultPassword = process.env.DEFAULT_PASSWORD || 'visualizer@admin';
        this.defaultLogo = process.env.DEFAULT_LOGO || 'https://i.imgur.com/lKKkB6R.png';
        this.AskCredentials = process.env.ASK_CREDENTIALS || "false"; 
        this.viewData = {
            logo: this.defaultLogo,
            version: pkg.version
        }
    }

    searchUser(username = '', password = '', req) {
        req.session.authenticated = false;
        req.session.username = '';
        req.session.password = '';

        if(username === this.defaultUsername && password === this.defaultPassword) {
            req.session.authenticated = true;
            req.session.username = username;
            req.session.password = password;
            return true;
        }  
        return false;
    }

    checkToken(req) {
        const bearerHeader = req.headers['authorization']
        if(typeof bearerHeader !== 'undefined'){
            const bearer = bearerHeader.split(' ')
            const bearerToken = bearer[1]
            return new Promise(resolve => {
                jwt.verify(bearerToken, secret, (err, auth) => {
                    if(err) {
                        resolve(false);
                    }
                    resolve(true);
                });
            })
        }
    }

    async authenticated(req) {
        const { username, password, authenticated } = req.session;
        if(this.AskCredentials === "false") { 
            return true
        } else {
            if(username && password && authenticated || await this.checkToken(req)) {
                return true;
            } else { 
                return false;
            }
        }
    }

    async authPage(req, res) {
        if(!await this.authenticated(req)) {
            res.render('login/index', {username: '', password: '', formError: false, ...this.viewData})
        } else {
            res.redirect('/');
        }
    }

    auth(req, res) { 
        const { username, password, authtype } = req.body;
        if(authtype && authtype === "xablau") {
            if(this.searchUser(username, password, req)){
                res.redirect('/')
            } else {
                res.render('login/index', {username, password, formError: true, ...this.viewData})
            }
        } else {
            if(this.searchUser(username, password, req)) { 
                jwt.sign(req.body, secret, (err, auth) => {
                    if(err) {
                        console.log(err)
                        return ;
                    }
                    res.send({auth});
                })
            } else {
                res.status(401).send({error: "Not Authorized"})
            }
        }
    }
}

module.exports = new User();