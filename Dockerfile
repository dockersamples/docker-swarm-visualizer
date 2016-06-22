FROM node:4.1.2-slim

WORKDIR /app

# Only run npm install if these files change
ADD ./package.json /app/package.json

# Install dependencies
RUN npm install --unsafe-perm=true

# Add the rest of the sources
ADD . /app

# Build the app
RUN npm run dist
ENV HOST "localhost"
ENV MS 200
ENV PORT 8080
EXPOSE 8080

CMD ["npm","start"]
