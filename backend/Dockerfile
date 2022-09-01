FROM node:16

# Create app directory
WORKDIR /src

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundling app source
COPY . .

EXPOSE 3001
CMD [ "node", "index.js" ]