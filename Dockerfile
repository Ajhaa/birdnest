FROM node:16-slim AS build

WORKDIR /app
COPY ./server .

RUN npm ci

RUN npm run build

COPY ./client ./client

ENV API_URL=https://ajhaa.fi/birdnest/pilots
RUN cd ./client && npm ci && npm run build
RUN mv ./client/build ./dist/www


FROM node:16-slim AS main

WORKDIR /app

COPY --from=build /app .

ENTRYPOINT [ "node", "./dist/app.js" ]
