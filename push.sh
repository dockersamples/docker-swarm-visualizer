
docker login -u turaaa -p sp2vrkQt
docker build -t=turaaa/swarmvisualizer:latest .
docker push turaaa/swarmvisualizer:latest
#docker swarm leave --force

