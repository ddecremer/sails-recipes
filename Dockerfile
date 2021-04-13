#  Define the version of Node.js to use for the image.  Versions can
#  be located in the Docker Hub:  https://hub.docker.com/_/node
FROM node:14.15-alpine3.10

#  Create app directory
WORKDIR /src

#  Install application dependencies
COPY package*.json ./

#  Install npm
RUN npm install 

#  Bundle app source code
COPY . .

#  Provide the application startup command
CMD ["node", "app.js"]