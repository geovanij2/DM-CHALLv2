FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies

COPY package.json ./
COPY yarn.lock ./

# npm install yarn --global
RUN yarn

COPY . .

RUN yarn tsc

# RUN yarn db-migrate up

# RUN node ./dist/src/db/populate.js

CMD ./scripts/start.sh