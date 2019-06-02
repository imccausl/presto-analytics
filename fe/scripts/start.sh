#!/bin/sh

yarn install

if [ "$NODE_ENV" == "production" ] ; then
  yarn build
else
  yarn start
fi
