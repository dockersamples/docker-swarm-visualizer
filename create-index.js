var fs = require('fs');
var indexFile = require('lodash')
  .template(fs.readFileSync('index.tpl'))(require('./credentials'))

fs.writeFileSync('./src/index.html',indexFile);
process.exit(0);
