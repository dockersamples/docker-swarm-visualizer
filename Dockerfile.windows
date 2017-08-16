FROM stefanscherer/node-windows:6.9.2-nano

WORKDIR /app

# Only run npm install if these files change.
ADD ./package.json /app/package.json

# Install dependencies
RUN npm install --unsafe-perm=true

# Add the rest of the sources
ADD . /app

# Build the app
RUN npm run dist

# Number of milliseconds between polling requests. Default is 200.
ENV MS 200

EXPOSE 8080

HEALTHCHECK CMD node healthcheck.js || exit 1

CMD ["npm.cmd","start"]
