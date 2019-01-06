FROM node:10-alpine
EXPOSE 3333 9229
COPY . ./app
WORKDIR /app
RUN npm install
CMD npm run dev