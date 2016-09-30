

![Sample image of  nodes with data](./nodes.png)

# Docker Swarm Visualizer
*** note ***
_This only works with Docker Swarm Mode in Docker Engine 1.12.0 and later. It does not work with the separate Docker Swarm project_
***note***
Thanks to all the contributors, and a special thanks to [@DovAmir](https://github.com/DovAmir) and [@alexellis](https://github.com/alexellis) for their big contributions.

Demo container that displays Docker services running on a Docker Swarm in a diagram.

This works only with [Docker Swarm Mode](https://docs.docker.com/engine/swarm/) which was introduced in Docker 1.12. These instructions presume you are running on the master node and you already have a Swarm running.

Each node in the swarm will show all tasks running on it. When a service goes down it'll be removed. When a node goes down it won't, instead the circle at the top will turn red to indicate it went down. Tasks will be removed.
Occasionally the Remote API will return incomplete data, for instance the node can be missing a name. The next time info for that node is pulled, the name will update.

To run: `docker run -it -d -p 8080:8080 -e HOST=[YOURHOST] -v /var/run/docker.sock:/var/run/docker.sock manomarks/visualizer`

If port 8080 is already in use on your host, you can specify e.g. `-p [YOURPORT]:[YOURPORT] -e HOST=[YOURHOST] -e PORT=[YOURPORT]` instead.

Example: `docker run -it -d -p 5000:5000 -e HOST=localhost -e PORT=5000 -v /var/run/docker.sock:/var/run/docker.sock manomarks/visualizer`

In some cases, you need to run the docker with your master node hostname instead the IP

Example: `docker run -it -d -p 5000:5000 -e HOST=node-master -e PORT=5000 -v /var/run/docker.sock:/var/run/docker.sock manomarks/visualizer`

## Running on ARM

[@alexellisuk](https://twitter.com/alexellisuk) has pushed an image to the Docker Hub as `alexellis2/visualizer-arm:latest` it will run the code on an ARMv6 or ARMv7 device such as the Raspberry Pi.

If you would like to build the image from source run the following command:

```
$ docker build -f Dockerfile.arm -t visualizer-arm:latest .
```



TODO:
* Take out or fix how dist works
* Comment much more extensively
* Create tests and make them work better
* Make CSS more elastic. Currently optimized for 3 nodes on a big screen
