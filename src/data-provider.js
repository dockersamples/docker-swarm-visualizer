import EventEmitter from 'eventemitter3';
import _ from 'lodash';
import padStart from 'string.prototype.padstart';
import { uuidRegExp } from './utils/helpers';

import {
    getUri,
    getParallel,
    getAllContainers,
    getAllNodes,
    getAllTasks,
    getAllServices,
    getAllNodeClusters,
    getWebSocket
} from './utils/request';

let STARTED = 0;

let SINGLETON;
let CURRENT_SERVICES_URIS;

let PHYSICAL_STRUCT;

let tutumEventHandler = (e) => {
    console.log(e);
};

let nodeOrContainerExists = (arr, value) => {

    for (var i = 0, iLen = arr.length; i < iLen; i++) {

        if (arr[i].ID == value) return true;
    }
    return false;
};

let strToHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
};

let hashToHexColor = (hash) => {
    let color = "#";
    for (var i = 0; i < 3;) {
        color += ("00" + ((hash >> i++ * 8) & 0xFF).toString(16)).slice(-2);
    }
    return color;
}

let stringToColor = (str) => {
    let hash = strToHash(str);
    let color = hashToHexColor(hash);
    return color;
};



let physicalStructProvider = ([initialNodes, initialContainers]) => {
    let containers = _.map(initialContainers, _.cloneDeep);
    let nodeClusters = [{ uuid: "clusterid", name: "" }];
    let nodes = _.map(initialNodes, _.cloneDeep);
    let root = [];

    let addContainer = (container) => {
            var cloned = Object.assign({}, container);
            let NodeID = cloned.NodeID;
            _.find(root, (cluster) => {
                var node = _.find(cluster.children, { ID: NodeID });
                if (!node) return;
                var dt = new Date(cloned.UpdatedAt);
                var color = stringToColor(cloned.ServiceID);
                let serviceName = cloned.ServiceName;
                let imageNameRegex = /([^/]+?)(\:([^/]+))?$/;
                let imageNameMatches = imageNameRegex.exec(cloned.Spec.ContainerSpec.Image);
                let tagName = imageNameMatches[3];
                let dateStamp = dt.getDate() + "/" + (dt.getMonth() + 1) + " " + dt.getHours() + ":" + padStart(dt.getMinutes().toString(), 2, "0");
                let startState = cloned.Status.State;




                let imageTag = "<div style='height: 100%; padding: 5px 5px 5px 5px; border: 2px solid " + color + "'>" +
                    "<span class='contname' style='color: white; font-weight: bold;font-size: 12px'>" + serviceName + "</span>" +
                    "<br/> image : " + imageNameMatches[0] +
                    "<br/> tag : " + (tagName ? tagName : "latest") +
                    "<br/>" + (cloned.Spec.ContainerSpec.Args ? " cmd : " + cloned.Spec.ContainerSpec.Args + "<br/>" : "") +
                    " updated : " + dateStamp +
                    "<br/>" + (cloned.Status.ContainerStatus? cloned.Status.ContainerStatus.ContainerID : "null") +
                    "<br/> state : " + startState +
                    "</div>";

                if (node.Spec.Role == 'manager') {
                    let containerlink = window.location.href + "apis/containers/" + cloned.Status.ContainerStatus.ContainerID + "/json";
                    cloned.link = containerlink;
                }
                cloned.tag = imageTag;
                cloned.state = startState;

                node.children.push(cloned);
                return true;
            });
        },

        updateContainer = (container, services) => {
            let { uuid, node } = container;
            let [nodeUuid] = uuidRegExp.exec(node);
            _.find(root, (cluster) => {
                let node = _.find(cluster.children, { uuid: nodeUuid });
                if (!node) return;

                let target = _.find(node.children, { uuid }) || {};
                if (!target) return;

                Object.assign(target, container);
                return true;
            });
        },

        data = () => {
            let clone = _.cloneDeep(root);
            _.remove(clone, ({ uuid, children }) => {
                return uuid === 'BYON' && !children.length
            });

            return { root: clone };
        },

        addNodeCluster = (nodeCluster) => {
            var cloned = Object.assign({}, nodeCluster);
            cloned.children = [];
            root.push(cloned);
        },

        removeNodeCluster = (nodeCluster) => {
            _.remove(root, { uuid: nodeCluster.uuid });
        },

        updateNodeCluster = (nodeCluster) => {
            var currentCluster = _.find(root, { uuid: nodeCluster.uuid });
            Object.assign(currentCluster, nodeCluster);
        },

        addNode = (node) => {
            let cloned = Object.assign({}, node);
            cloned.children = [];
            let clusterUuid = "clusterid";
            let cluster = _.find(root, { uuid: clusterUuid });
            if (cluster) cluster.children.push(cloned);
        },
        updateNode = (node, state, spec) => {
            node.state = state;
            node.Spec = spec;
        },
        updateData = (resources) => {
            updateNodes(resources[0]);

            updateContainers(resources[1], resources[2]);
            data();
        },
        updateNodes = (nodes) => {
            let currentnodelist = root[0].children;
            for (let node of nodes) {
                if (!nodeOrContainerExists(currentnodelist, node.ID)) {
                    updateNode(node, 'ready');

                    addNode(node);
                } else {
                    for (let currentnode of currentnodelist) {
                        if (node.ID == currentnode.ID) {
                            name = node.Description.Hostname;
                            if (name.length > 0) {
                                currentnode.Description.Hostname = name;
                                currentnode.name = name + " <br/><span class='noderole'>" + node.Spec.Role +
                                    "</span><br/><span class='nodemem'>" + (currentnode.Description.Resources.MemoryBytes / 1024 / 1024 / 1024).toFixed(3) + "G RAM</span><br/>" +
                                    "<span class='nodeplatform'>" + (currentnode.Description.Platform.Architecture) + "/" + (currentnode.Description.Platform.OS) + "</span>" +
                                    "<div class='labelarea'>";
                                for (var key in node.Spec.Labels) {
                                    if (node.Spec.Labels[key].length > 0) {
                                        currentnode.name += " <br/><span class='nodelabel'>" + key + "=" + node.Spec.Labels[key] + "</span>";
                                    } else {
                                        currentnode.name += " <br/><span class='nodelabel'>" + key + "</span>";
                                    }
                                }
                                currentnode.name += "</div>"
                            }
                            updateNode(currentnode, node.state, node.Spec);
                        }
                    }

                }
            }
            for (let node of currentnodelist) {
                if (!nodeOrContainerExists(nodes, node.ID)) {
                    updateNode(node, 'down');
                }
            }
        },
        updateContainers = (containers, services) => {
            let nodes = root[0].children;
            // clearn all current children before rendering
            for (let node of nodes) {
                node.children = [];
            }

            for (let container of containers) {
                let contNodeId = container.NodeID;
                let service = _.find(services, function(o) { return o.ID == container.ServiceID; });
                
		container.ServiceName = service? service.Spec.Name : "null";
                for (var i = 0, iLen = nodes.length; i < iLen; i++) {
                    if (nodes[i].ID == contNodeId) {
                        addContainer(container);
                    }
                }

            }

        };

    nodeClusters.forEach(addNodeCluster);
    nodes.forEach(addNode);

    containers.forEach(addContainer);

    return {
        addContainer,
        updateData,
        updateContainer,
        data,
        addNode,
        updateNode,
        addNodeCluster,
        removeNodeCluster,
        updateNodeCluster,
    };
}

class DataProvider extends EventEmitter {
    constructor() {
        super()
    }

    start() {
        STARTED = 1;
        //console.log(STARTED);
        var clusterInit = Promise.all([
                getAllNodes(),
                getAllTasks(),
                getAllServices()
            ])
            .then((resources) => {
                _.remove(resources[1], (nc) => nc.state === 'Empty cluster' || nc.state === 'Terminated');
                return resources;
            });

        Promise.all([clusterInit])
            .then(([resources]) => {
                PHYSICAL_STRUCT = physicalStructProvider(resources);
                this.emit('infrastructure-data', PHYSICAL_STRUCT.data());
                this.emit('start-reload');
            });
    }

    reload() {
        if (STARTED == 0) return;
        STARTED++;

        // console.log(STARTED);
        var clusterInit = Promise.all([
                getAllNodes(),
                getAllTasks(),
                getAllServices()
            ])
            .then((resources) => {
                _.remove(resources[1], (nc) => nc.state === 'Empty cluster' || nc.state === 'Terminated');
                return resources;
            });

        Promise.all([clusterInit])
            .then(([resources]) => {
                if (!PHYSICAL_STRUCT)
                    PHYSICAL_STRUCT = physicalStructProvider(resources);
                PHYSICAL_STRUCT.updateData(resources);
                this.emit('infrastructure-data', PHYSICAL_STRUCT.data());
            });
    }
}

export default SINGLETON = new DataProvider();
