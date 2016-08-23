
docker build -t=datarails/datarailsserver:visualizer .
docker push datarails/datarailsserver:visualizer
docker swarm leave --force

