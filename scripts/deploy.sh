#!/bin/sh

set -e
npm run build
rsync -azvhP ecosystem.config.js digitalocean:space.colinthornton.site
rsync -azvhP --delete-after .output/ digitalocean:space.colinthornton.site/.output/
ssh -t digitalocean "cd ~/space.colinthornton.site && pm2 start"
