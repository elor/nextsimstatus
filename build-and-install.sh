#!/bin/bash

set -e -u

cd "$(dirname "$(readlink -f "$0")")"

git pull || :

# copy daemons over
rsync -rv --delete ./daemons/ /opt/nextsimstatus

# build single page application
podman-compose run nextsimstatus npm run build

# deploy single page application
rsync -rv --delete ./dist/ /srv/www/status

# restart docker daemons if necessary
(
	cd /opt/nextsimstatus/
	podman-compose up --build --detach -t 1
)

echo "Success"
