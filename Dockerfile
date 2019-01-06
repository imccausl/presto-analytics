FROM node:10-alpine
EXPOSE 3333 9229
COPY . ./app
WORKDIR /app
CMD ./scripts/start.sh