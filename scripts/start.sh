#!/bin/sh

yarn db-migrate up
node ./dist/src/db/populate.js
node ./dist/src/index.js
#yarn start