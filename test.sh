#!/bin/bash
set -e

cd /home/ubuntu/xmplaylist
git pull
yarn workspace frontend build
pm2 restart xmpnext
