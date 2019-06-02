FROM node:10-alpine

WORKDIR /app

ADD yarn.lock ./
ADD package.json ./

RUN yarn

ADD . /app

EXPOSE 3000
EXPOSE 35729

CMD ./scripts/start.sh
