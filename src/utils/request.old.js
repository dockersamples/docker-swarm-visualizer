import request from 'superagent';
import _ from 'lodash';

const API_LIMIT = 250;

function asPromise(fn){
  return new Promise((resolve,reject) => fn((err,res) => err ? reject(err) : resolve(res)))
}

function asPromiseAndJSON (fn) {
  return asPromise(fn).then((res) => res.body);
}

function createAgent(uri){
  var agent = request
    .get(uri)
    .set('Authorization', AUTH)
    .set('Accept', 'application/json');

  _.bindAll(agent,['end']);

  return agent;
}

function filterTerminatedObjects (objects) {
  return _.filter(objects,({state}) => state !== 'Terminated');
}


export function getUri(uri){
  return asPromiseAndJSON(createAgent(uri).end);
}

export function getParallel(uris){
  return Promise.all(uris.map(getUri))
}

export function getStack(uuid){
  return getUri(`/api/v1/stack/${uuid}/`);
}

export function getAllContainers(){
  return getUri(`/api/v1/container/?limit=${API_LIMIT}`)
    .then(({ objects }) => filterTerminatedObjects(objects))
}

export function getAllNodes(){
  return getUri(`/api/v1/node/?limit=${API_LIMIT}`)
    .then(({ objects }) => filterTerminatedObjects(objects) );
}

export function getAllNodeClusters(){
  return getUri(`/api/v1/nodecluster/?limit=${API_LIMIT}`)
    .then(({ objects }) => filterTerminatedObjects(objects));
}

export function getAllStacks(){
  return getUri(`/api/v1/stack/?limit=${API_LIMIT}`)
    .then(({ objects }) => filterTerminatedObjects(objects));
}

