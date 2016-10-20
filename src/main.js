// ORDER MATTERS!
import physicalVisualization from './vis-physical';
import provider from './data-provider';
import { hasClass, removeClass, addClass, uuidRegExp } from './utils/helpers';
let { MS } = window;

require('normalize.css');
require('animate.css/animate.css');
require('./main.less');

function parseQuery(qstr) {
  var query = {};
  var a = qstr.substr(1).split('&');
  for (var i = 0; i < a.length; i++) {
      var b = a[i].split('=');
      query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
  }
  return query;
}

let query = parseQuery(window.location.search);
let tabPhysical = document.getElementById('tab-physical');
let physical = document.getElementById('vis-physical');

tabPhysical.addEventListener('click',() => {
  removeClass(physical, 'hidden');
  removeClass(tabPhysical, 'hidden');

  document.body.className = 'tab2';
});

/* Enable polling */
function reload(){
  provider.reload();
  setTimeout(reload, MS);
}

console.log("Polling refresh: " + MS);

provider.on('infrastructure-data', physicalVisualization.render);
provider.start();
reload();

//TODO: Emit Event that requeries data, removes old data recreates visualizations
