'use strict';

import './styles.less';
import d3 from 'd3';
import _ from 'lodash';
import { tutum as tutumLogoSVG } from '../icons';

var NAME;
var header = d3.select('body').insert('header','.tabs');

  header
    .append('div')
    .classed('logo',true)
    .html('<span>Tutum Visualizer</span>' + tutumLogoSVG);

var stack = header
  .append('div')
  .classed('stack-name',true)
  .classed('hidden',true);

stack.append('span');
stack.append('div')
  .classed('stack-open',true);

var stackList = header.append('ul')
  .classed('hidden',true)
  .classed('stack-list',true);

stack.on('click',() => {
  stackList.classed('hidden', function(d) {
    return !d3.select(this).classed('hidden');
  });
})

var stackListItems = stackList.selectAll('.stack-list-item');

var STACKS = [];

function render(){
  stackListItems = stackListItems.data(STACKS);

  stackListItems
    .enter()
    .append('li')
    .classed('stack-list-item',true)
    .html((d) => d.name)
    .on('click',function(d){
      var tab = document.body.className.replace(/\s/g, '');
      window.location = `?uuid=${d.uuid}&tab=${tab}`;
    })

  stackListItems.exit().remove();

}



export default {
  select({name}){
    NAME = name;

    stack
    .classed('hidden',false)
    .select('span').html(name);
  },

  add(stacks){
    STACKS.push(...stacks.filter(({name}) => name !== NAME));
    render();
  },

  remove(stack){
    _.remove(STACKS,({uuid}) => uuid === stack.uuid);
    render();
  }
}
