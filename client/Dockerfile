FROM node:10-alpine

RUN mkdir -p /opt/app
WORKDIR /opt/app

COPY package*.json /opt/app/
RUN npm install

COPY . /opt/app

CMD ./scripts/start.sh