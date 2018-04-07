#Latest version of node tested on.
FROM node:8.2.1-alpine AS dist

WORKDIR /app

# Only run npm install if these files change.
ADD ./package.json /app/package.json

# Install dependencies
RUN npm install

# Add the rest of the sources
ADD . /app

RUN npm run dist


FROM node:8.2.1-alpine

# MS : Number of milliseconds between polling requests. Default is 1000.
# CTX_ROOT : Context root of the application. Default is /
ENV MS=1000 CTX_ROOT=/

EXPOSE 8080

HEALTHCHECK CMD node /app/healthcheck.js || exit 1

CMD ["npm","start"]

WORKDIR /app
COPY --from=dist /app/package.json /app/package.json
COPY --from=dist /app/node_modules /app/node_modules
#RUN npm install

COPY --from=dist /app/dist/* /app/dist/
ADD ./cfg/* /app/cfg/
ADD ./src/* /app/src/
ADD ./create-index.js /app
ADD ./index.tpl /app
ADD ./server.js /app
ADD ./healthcheck.js /app