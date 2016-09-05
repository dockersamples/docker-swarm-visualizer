#RUN npm install --unsafe-perm=true
docker swarm leave --force

docker swarm init  --advertise-addr 127.0.0.1:2377
docker service create rabbitmq:3.6.5
docker service create --with-registry-auth --restart-condition on-failure --restart-delay 5s  --name django --replicas 3     --publish 8081:80/tcp datarails/datarailsserver:latest ./run_web.sh prod-azure


npm run dist && npm start

#docker swarm leave --force


