import request from 'superagent';
import _ from 'lodash';

var host = window.location.href.split('?')[0].split('#')[0] + 'apis/';
var wsHost = ((window.location.protocol === "https:") ? "wss://" : "ws://") + window.location.host + window.location.pathname;

function asPromise(fn){
  return new Promise((resolve,reject) => fn((err,res) => err ? reject(err) : resolve(res)))
}

function asPromiseAndJSON (fn) {
  return asPromise(fn).then((res) => res.body);
}

function createAgent(uri){
  var agent = request
    .get(uri)
    .set('Accept', 'application/json');
  _.bindAll(agent,['end']);
  return agent;
}



function filterStoppedTasks (objects) {
  let runningTasks = [];
  for(let i=0;i<objects.length;i++){
    let object = objects[i];
    if( object.DesiredState=="running") { //object.Status.State=="running" &&
      runningTasks.push(object);
    }
  }
  return runningTasks;
}

function filterStoppedNodes (objects) {
  let readyNodes = [];
  for(let i=0;i<objects.length;i++){
    let object = objects[i];
    if(object.Status.State==="ready") {
	    object.state = "ready";
    } else {
	object.state = "down"
    }
    object.name = object.Description.Hostname;
    object.name= object.name+" <br/>"+object.Spec.Role+
        " <br/>"+(object.Description.Resources.MemoryBytes/1000000000).toFixed(3)+"G free"+
        " <br/>"+(object.Spec.Labels);
    readyNodes.push(object);
  }
  readyNodes.sort(function (a, b) {
  if (a.Description.Hostname > b.Description.Hostname) {
    return 1;
  }
  if (a.Description.Hostname < b.Description.Hostname) {
    return -1;
  }
  // a must be equal to b
  return 0;
});
  return readyNodes;
}
function filterTerminatedObjects (objects) {
  return _.filter(objects,({State}) => State !== '"shutdown"');
}


export function getUri(uri){
  return asPromiseAndJSON(createAgent(uri).end);
}

export function getParallel(uris){
  return Promise.all(uris.map(getUri))
}
export function getWebSocket(){
  console.log(wsHost);
  let ws = new WebSocket(`${wsHost}`);
  return ws;
}

export function getAllContainers(){
    return getUri(host+`containers/json`)
    .then(({ objects }) => filterTerminatedObjects(objects))
}

export function getAllServices(){
    return getUri(host+`services`)
    .then(({ objects }) => filterTerminatedObjects(objects))
}
export function getAllTasks(){
    return getUri(host+`tasks`).then(({ objects }) => filterStoppedTasks(objects))
}

export function getAllNetworks(){
    return getUri(host+`networks`)
    .then(({ objects }) => filterTerminatedObjects(objects))
}
export function getAllNodes(){
  return getUri(host+`nodes`).then(({ objects }) => filterStoppedNodes(objects))
}

export function getAllNodeClusters(){
  return filterTerminatedObjects({"meta": {"limit": 25, "next": null, "offset": 0, "previous": null, "total_count": 1}, "objects": [{"availability_zone": "/api/infra/v1/az/aws/ap-southeast-2/ap-southeast-2b/", "cpu": 1, "current_num_containers": 1, "deployed_datetime": "Thu, 10 Mar 2016 00:04:58 +0000", "destroyed_datetime": null, "disk": 60, "docker_execdriver": "native-0.2", "docker_graphdriver": "aufs", "docker_version": "1.9.1-cs2", "external_fqdn": "00cc59e1-c605-403c-a5fb-3269b6a0d6bf.node.dockerapp.io", "last_seen": "Fri, 10 Jun 2016 03:39:54 +0000", "memory": 512, "nickname": "00cc59e1-c605-403c-a5fb-3269b6a0d6bf.node.dockerapp.io", "node_cluster": "/api/infra/v1/nodecluster/32197879-6a60-4e17-9548-8d6f90fd8af2/", "node_type": "/api/infra/v1/nodetype/aws/t2.nano/", "private_ips": [{"cidr": "10.78.112.4/18", "name": "eth0"}], "public_ip": "52.63.118.253", "region": "/api/infra/v1/region/aws/ap-southeast-2/", "resource_uri": "/api/infra/v1/node/00cc59e1-c605-403c-a5fb-3269b6a0d6bf/", "state": "Deployed", "tunnel": null, "uuid": "00cc59e1-c605-403c-a5fb-3269b6a0d6bf"}]});
}
