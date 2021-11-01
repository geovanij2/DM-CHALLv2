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

# RUN ["chmod", "+x", "/usr/src/app/scripts/start.sh"]

CMD ./scripts/start.sh