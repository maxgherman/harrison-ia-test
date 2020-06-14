# official image
FROM node:13.12.0-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent

# application
COPY . ./

# build
RUN npm run lint
RUN CI=true npm test
RUN npm run build

# run
EXPOSE 8080
CMD [ "node", "./build/index.js" ]
