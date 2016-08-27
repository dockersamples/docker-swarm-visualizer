'use strict';

import './styles.less';
import d3 from 'd3';
import _ from 'lodash';

import { uuidRegExp, capitalize } from '../utils/helpers';

var { innerWidth:W, innerHeight:H } = window;

var vis = d3.select('#app')
  .append('div')
  .attr('id','vis-physical');

var wrapper = vis.append('div')
  .classed('wrapper', true);

function removeVis() {
  cluster = wrapper.selectAll('.node-cluster')
  cluster.remove();
}

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

  container.on('mouseenter',null);
  container.on('mouseleave',null);

  cluster.exit().remove();
  container.exit().remove();
  node.exit().remove();
}

export default { render }
