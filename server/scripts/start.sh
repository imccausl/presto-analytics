#!/bin/sh

cd server && npm install

if [ "$NODE_ENV" == "production" ] ; then
 npm run start
else
 npm run dev
fi