#Latest version of node tested on.
FROM node:12-alpine AS dist


# Tini is recommended for Node apps https://github.com/krallin/tini
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

WORKDIR /app

# Only run npm install if these files change.
COPY package*.json ./

# Install dependencies
RUN npm ci

# Add the rest of the source
COPY . .

# run webpack
RUN npm run dist

# MS : Number of milliseconds between polling requests. Default is 1000.
# CTX_ROOT : Context root of the application. Default is /
ENV MS=1000 CTX_ROOT=/

EXPOSE 8080

HEALTHCHECK CMD node /app/healthcheck.js || exit 1

CMD ["node","server.js"]
