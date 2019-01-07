FROM node:10-alpine

RUN mkdir -p /opt/backend
EXPOSE 9229

WORKDIR /opt/backend
COPY . /opt/backend

CMD ./scripts/start.sh