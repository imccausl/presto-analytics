#!/bin/sh

cd server && npm install && cd ..
cd fe && npm install && cd ..

if [ "$NODE_ENV" == "production" ] ; then
  cd server && npm run start
else
  cd server && npm run dev
fi