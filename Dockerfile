FROM node:10-alpine

RUN mkdir -p /opt
EXPOSE 9229
EXPOSE ${PORT}

WORKDIR /opt
COPY ./ /opt

CMD ./server/scripts/start.sh
