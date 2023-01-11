FROM node:16-slim

WORKDIR /app
COPY ./server .

RUN npm ci

RUN npm run build

ENTRYPOINT [ "node", "./dist/app.js" ]
