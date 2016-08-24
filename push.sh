
docker build -t=turaaa/swarmvisualizer:latest .
docker push turaaa/swarmvisualizer:latest
docker swarm leave --force

