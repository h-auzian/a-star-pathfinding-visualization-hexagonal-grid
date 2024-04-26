FROM node:20-slim

WORKDIR /usr/app

COPY package.json package-lock.json .
RUN npm install

CMD npm start
