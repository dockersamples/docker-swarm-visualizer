'use strict';

import './styles.less';
import d3 from 'd3';
import _ from 'lodash';

import { uuidRegExp, capitalize } from '../utils/helpers';
import { filterContainers, filterOnLoad } from "../utils/filter-containers";

var { innerWidth:W, innerHeight:H } = window;

var vis = d3.select('#app')
    .append('div')
    .attr('id','vis-physical');

var wrapper = vis.append('div')
    .classed('wrapper', true);

let filterDiv = wrapper.append('div')
    .attr('id', 'filter-wrapper');

let filterInput = filterDiv.append('input')
    .attr('id', 'filter')
    .attr('placeholder', 'filter containers');

filterInput.on('keyup', filterContainers);
filterOnLoad();

function removeVis() {
  cluster = wrapper.selectAll('.node-cluster')
  cluster.remove();
}

let loadScript=(url, callback) =>{

    var script = document.createElement("script")
    script.type = "text/javascript";
    if (script.readyState) { //IE
        script.onreadystatechange = function() {
            if (script.readyState == "loaded" || script.readyState == "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else { //Others
        script.onload = function() {
            callback();
        };
    }
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

let showContainer =(url) =>{

    loadScript("https://code.jquery.com/jquery-3.1.0.min.js", function() {
        $.getJSON(url, function(obj) {

            var str = JSON.stringify(obj, undefined, 4);
            var myWindow = window.open("data:application/json," + encodeURIComponent(str) ,  "_blank");
            myWindow.focus();
        });
    });
};

function render ({root}) {
  var cluster, node, container, clusterEnter, nodeEnter;
  cluster = wrapper.selectAll('.node-cluster').data(root);

  clusterEnter = cluster
      .enter()
      .append('div')
      .classed('node-cluster',true)
      .classed('byon',(d) => d.uuid === 'BYON');

  clusterEnter
      .append('div')
      .classed('node-cluster-meta',true);

  clusterEnter
      .append('div')
      .classed('node-cluster-content',true);

  node = cluster
      .select('.node-cluster-content')
      .selectAll('.node').data((d) => d.children);

  nodeEnter = node.enter()
      .append('div')
      .classed('node',true)

  nodeEnter.append('div')
      .classed('node-meta',true);

  nodeEnter.append('div')
      .classed('node-content',true);

  container = node
      .select('.node-content')
      .selectAll('.container').data((d) => d.children);


  container.enter()
      .append('div')
      .classed('container',true);

  cluster
      .select('.node-cluster-meta')
      .html(({name,state = '', node_type = '', region = ''}) => {

    // This is a HORRIBLE hack
    // but I don't wanna fetch nodeTypes from the API as from now
    var displayType = node_type.split('/')[4] || ''; // horrible
  var displayRegion = region.split('/')[5] || ''; // horrible

  switch(displayType){
    case 'digitalocean': displayType = 'Digital Ocean'; break;
    case 'aws': displayType = 'AWS'; break;
  }

  return `<span data-state='${_.kebabCase(state || "byon")}' class='name'>${name}</span>`;
});

node
    .select('.node-meta')
    .attr('name',(d) => _.kebabCase(d.name))
.attr('data-state',(d) => _.kebabCase(d.state))
.html((d) => d.name);


container
    .classed('foreign', (d) => !d.state)
.attr('tag',(d) => _.kebabCase(d.tag)).html((d) => d.tag)
.attr('data-state',(d) => _.kebabCase(d.state))


container.on('mouseenter',null);
container.on('mouseleave',null);
// container.on('click', function(){
//     if (d3.select(this)[0][0].__data__.link){
//         showContainer(d3.select(this)[0][0].__data__.link)
//     }
// });


cluster.exit().remove();
container.exit().remove();
node.exit().remove();
}

export default { render }
