

docker swarm init  --advertise-addr 127.0.0.1:2377
docker service create rabbitmq:3.6.5

npm run dist && npm start


#docker swarm leave --force

