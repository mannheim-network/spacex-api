FROM node:current-alpine3.10

# Create spacex-api directory
WORKDIR /usr/src/spacex-api

# Move source files to docker image
COPY . .

# Install dependencies
RUN npm install && npm run build

# Run
ENTRYPOINT npm start $ARGS
