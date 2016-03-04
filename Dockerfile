FROM node:latest

# Create app directory
RUN mkdir -p /usr/src/theseus
WORKDIR /usr/src/theseus

# Install app dependencies
COPY package.json /usr/src/theseus/
RUN npm install

# Bundle app source
COPY . /usr/src/theseus