FROM node:10-alpine

RUN mkdir -p /opt
EXPOSE 9229

WORKDIR /opt
COPY ./ /opt

CMD ./api/scripts/start.sh
