#!/bin/sh
set -eo pipefail

yarn install

if [ "$NODE_ENV" == "production" ] ; then
  yarn build
else
  yarn start | cat
fi
