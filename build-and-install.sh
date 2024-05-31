#!/bin/bash

set -e -u

cd "$(dirname "$(readlink -f "$0")")"

podman-compose run nextsimstatus npm run build

rsync --delete ./dist/ /srv/www/status
