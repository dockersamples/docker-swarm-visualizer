#Latest version of node tested on.
FROM node:4.7-alpine

WORKDIR /app

# Only run npm install if these files change.
ADD ./package.json /app/package.json

# Install dependencies
RUN npm install --unsafe-perm=true

# Add the rest of the sources
ADD . /app


# Build the app
RUN npm run dist

# Number of milliseconds between polling requests. Default is 1000.
ENV MS 1000

EXPOSE 8080

CMD ["npm","start"]
