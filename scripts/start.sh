#!/bin/sh

yarn db-migrate up
node ./dist/src/db/populate.js
yarn start