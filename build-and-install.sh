#!/bin/bash

set -e -u

cd "$(dirname "$(readlink -f "$0")")"

# webpage
podman-compose run nextsimstatus npm run build

rsync -rv --delete ./dist/ /srv/www/status

# daemons
rsync -rv --delete ./daemons/ /opt/nextsimstatus

(
	cd /opt/nextsimstatus/
	podman-compose up --build --detach -t 1
)

echo "Success"
