'use strict';

import './styles.less';
import d3 from 'd3';
import _ from 'lodash';

import { uuidRegExp, capitalize } from '../utils/helpers';
import * as icons from '../icons';

var W = window.innerWidth,
    H = window.innerHeight - 110, // header, etc
    NODE_MIN_RADIUS = 40,
    NODE_INCREMENT_RADIUS = 3,
    NODES = [],
    LINKS = [],
    node,
    link;

function calculateLinks(services){
  var serviceLinks = [];

  services.forEach((target) => {
    var { linked_from_service:links } = target;

    if(typeof links == 'undefined') return;

    links.forEach((link,i) => {
      const [uuid] = uuidRegExp.exec(link.from_service);
      const source = _.find(services,{ uuid });
      if(!source) return;
      serviceLinks.push({ source,target });
    });
  });

  return serviceLinks;
}

var svg = d3.select('#app')
  .append('div')
  .attr('id','vis-logical')
  .append('svg')
  .attr('width', W)
  .attr('height', H);

var force = d3.layout.force()
  .nodes(NODES)
  .links(LINKS)
  .size([W, H])
  .charge(-1000)
  .linkDistance(function(d){
    const factor = d.source.linked_from_service.length + d.source.linked_to_service.length;
    return (H/2) * (1/factor);
  })
  .on('tick', tick);

function tick() {
  link
    .attr('x1', (d) => d.source.x)
    .attr('y1', (d) => d.source.y)
    .attr('x2', (d) => d.target.x)
    .attr('y2', (d) => d.target.y);

  node.select('circle')
    .attr('cx', (d) => d.x)
    .attr('cy', (d) => d.y);

  node
    .select('.docker-image svg')
    .attr('x', (d) => d.x - 15)
    .attr('y', (d) => d.y - 32);

  var nodeText = node.select('text');

  nodeText
    .select('.name')
    .attr('x', (d) => d.x)
    .attr('y', (d) => d.y + 5);

  nodeText
    .select('.num-containers')
    .attr('x', (d) => d.x)
    .attr('y', (d) => d.y + 25);

}

function restart(){
  if(node){
    node.on('mousedown',null);
    node.on('mouseup',null);
  }

  link = svg.selectAll('.link').data(LINKS);
  node = svg.selectAll('.service').data(NODES);

  link.enter().insert('line', '.service')
    .attr('class', 'link');

  link.exit().remove();

  var nodeEnter = node.enter().append('g').call(force.drag);

  nodeEnter
    .append('circle')
    .attr('r',NODE_MIN_RADIUS);

  nodeEnter.insert('g')
    .classed('docker-image',true)
    .html((d) => {
      console.log(d);
      //var image = d.image_name.split(':')[0] || [];
      var image = d.image.split(':')[0] || [];
      if(image.indexOf('haproxy') > -1){
        return icons.haproxy;
      }
      else if(image.indexOf('results-demo') > -1){
        return icons.angular;
      }
      else if(image.indexOf('voting-demo') > -1){
        return icons.python;
      }

      var [namespace,imageName] = image.split('/');

      if(!imageName){
        imageName = namespace;
        namespace = 'library';
      }

      if(namespace === 'tutum') return icons.tutum;

      return icons[imageName] || (namespace === 'tutum' ? icons.tutum : icons.docker);
    })
    .select('svg')
    .attr('width',30)
    .attr('height',30)

  var nodeEnterText = nodeEnter.append('text');

  nodeEnterText
    .append('tspan')
    .classed('name',true)
    .attr('dy', '.35em')

  nodeEnterText
    .append('tspan')
    .classed('num-containers',true)
    .attr('dy', '.35em')

  node.attr('class',(d) =>
    `service service-${_.kebabCase(d.state)} service-${_.kebabCase(d.name)}`);

  node
    .select('circle')
    .transition()
    .attr('r', (d) => NODE_MIN_RADIUS + d.running_num_containers * 3);

  node.exit().remove();

  var nodeText = node.select('text');

  nodeText
    .select('.name')
    .text((d) => capitalize(d.name));

  nodeText
    .select('.num-containers')
    .text((d) => d.running_num_containers);

  node.on('mousedown',function() {
    d3.select(this).classed('dragging',true);
  });

  node.on('mouseup',function() {
    d3.select(this).classed('dragging',false);
  });

  force.start();
}

export default {
  add(services){
    console.log('CREATE', _.map(services,'name'));
    var newServices = _.filter(
      services,({uuid}) => !!!_.find(NODES,{uuid})
    );

    NODES.push(...newServices);
    LINKS = calculateLinks(services);
    restart();
  },
  update(service){
    console.log('UPDATE', service.name);
    let {uuid} = service;
    let target = _.find(NODES,{ uuid }) || {};
    Object.assign(target,service);
    LINKS = calculateLinks(NODES);
    restart();
  },
  remove(service){
    console.log('DELETE', service.name);
    _.remove(NODES,({uuid}) => uuid === service.uuid);
    LINKS = calculateLinks(NODES);
    restart();
  }
}
