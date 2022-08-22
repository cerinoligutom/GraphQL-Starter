# Declare a Docker build-time variable
ARG NODE_IMAGE_VERSION=16.14.2-alpine

### Builder Stage ###

FROM node:${NODE_IMAGE_VERSION} as builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY patches ./patches
RUN ls -al
RUN npm ci

# Copy files from host to container then list it
COPY ./ ./
RUN ls -al

# Build project
RUN npm run build:prod

# List files under build directory for reference
RUN ls -al build

### Final Stage ###

FROM node:${NODE_IMAGE_VERSION} as app

ENV NODE_ENV=production

EXPOSE 8080

WORKDIR /usr/src/app

# Copy the necessary files from the builder stage to this stage
COPY --chown=node:node --from=builder /usr/src/app/build .

# https://typicode.github.io/husky/#/?id=with-npm
RUN npm set-script prepare ""
# Install production dependencies only
RUN npm ci --production

# List the final directory for reference
RUN ls -al

# https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#non-root-user
USER node

CMD ["node", "./src/app.js"]
