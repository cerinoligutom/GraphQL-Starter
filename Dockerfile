FROM node:10.15-alpine

WORKDIR /usr/src/app

# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#node-gyp-alpine
RUN apk add --no-cache --virtual .gyp python make g++

COPY package*.json ./

RUN npm install

# Copy files from host to container
COPY ./ ./

RUN ls -al

EXPOSE 8080

CMD [ "npm", "run", "production" ]
