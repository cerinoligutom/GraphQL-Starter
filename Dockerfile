# Declare a Docker build-time variable
ARG NODE_IMAGE_VERSION=12-alpine

### Builder Stage ###

FROM node:${NODE_IMAGE_VERSION} as builder

WORKDIR /usr/src/app

# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#node-gyp-alpine
RUN apk add --no-cache --virtual .gyp python make g++

# Prepare dependencies
COPY package*.json ./
RUN npm ci

# Copy files from host to container then list it
COPY ./ ./
RUN ls -al

# Build project
RUN npm run build

# List files under build directory for reference
RUN ls -al build


### Final Stage ###

FROM node:${NODE_IMAGE_VERSION} as app

WORKDIR /usr/src/app

# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#node-gyp-alpine
RUN apk add --no-cache --virtual .gyp python make g++

# Copy the necessary files from the builder stage to this stage
COPY --from=builder /usr/src/app/build .

# TODO: Use npm ci --production when the raised issue from graphql-tools gets resolved
COPY --from=builder /usr/src/app/node_modules ./node_modules

# List the directory on this build stage
RUN ls -al

EXPOSE 8080

CMD ["npm", "run", "production"]
