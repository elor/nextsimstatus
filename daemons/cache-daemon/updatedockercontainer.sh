#!/bin/bash

set -e -u

image=mainsim.etit.tu-chemnitz.de:5555/simadmin/mainsimstatus/cache-daemon
container=mainsimstatus-cache
portforward=1880:8080

docker pull $image
docker stop $container
docker rm $container
docker run --detach --restart=always --name=$container --publish=$portforward $image
