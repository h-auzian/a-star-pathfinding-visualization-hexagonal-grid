FROM node:20-slim

WORKDIR /usr/app

COPY package.json .
RUN npm install

CMD npm start
