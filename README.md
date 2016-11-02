This project is a fork from [ManoMarks](https://github.com/ManoMarks/docker-swarm-visualizer) with a different style.

![Sample image of  nodes with data](./nodes.png)

# Docker Swarm Visualizer
*** note ***
_This only works with Docker Swarm Mode in Docker Engine 1.12.0 and later. It does not work with the separate Docker Swarm project_

Demo container that displays Docker services running on a Docker Swarm in a diagram.

This works only with [Docker Swarm Mode](https://docs.docker.com/engine/swarm/) which was introduced in Docker 1.12. These instructions presume you are running on the master node and you already have a Swarm running.

Each node in the swarm will show all tasks running on it. When a service goes down it'll be removed. When a node goes down it won't, instead the circle at the top will turn red to indicate it went down. Tasks will be removed.
Occasionally the Remote API will return incomplete data, for instance the node can be missing a name. The next time info for that node is pulled, the name will update.

To run:

```
$ docker run -it -d -p 8080:8080 -v /var/run/docker.sock:/var/run/docker.sock bargenson/docker-swarm-visualizer
```

If port 8080 is already in use on your host, you can specify e.g. `-p [YOURPORT]:8080` instead. Example:

```
$ docker run -it -d -p 5000:8080 -v /var/run/docker.sock:/var/run/docker.sock bargenson/docker-swarm-visualizer
```

To run in a docker swarm:

```
$ docker service create \
  --name=viz \
  --publish=8080:8080/tcp \
  --constraint=node.role==manager \
  --mount=type=bind,src=/var/run/docker.sock,dst=/var/run/docker.sock \
  bargenson/docker-swarm-visualizer
```

## Running on ARM

[@alexellisuk](https://twitter.com/alexellisuk) has pushed an image to the Docker Hub as `alexellis2/visualizer-arm:latest` it will run the code on an ARMv6 or ARMv7 device such as the Raspberry Pi.

If you would like to build the image from source run the following command:

```
$ docker build -f Dockerfile.arm -t visualizer-arm:latest .
```
