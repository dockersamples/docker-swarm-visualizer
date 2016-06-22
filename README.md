# Tutum Visualizer

[![Deploy to Tutum](https://s.tutum.co/deploy-to-tutum.svg)](https://dashboard.tutum.co/stack/deploy/)

Demo container that displays services on a diagram.

Each node in the swarm will show all tasks running on it. When a service goes down it'll be removed. When a node goes down it won't, instead the circle at the top will turn red to indicate it went down. Tasks will be removed.
Occasionally the Remote API will return incomplete data, for instance the node can be missing a name. The next time info for that node is pulled, the name will update.


TODO:
* Take out or fix how dist works
* Comment much more extensively
* Create tests and make them work better
* Make CSS more elastic. Currently optimized for 3 nodes on a big screen

