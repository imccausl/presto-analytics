FROM node:10-alpine
EXPOSE 3333 9229
COPY . $HOME/code/presto-analytics
WORKDIR $HOME/code/presto-analytics
RUN npm install
CMD npm run dev