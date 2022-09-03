FROM node:16

# Create app directory
WORKDIR /src

# Install app dependencies
COPY package*.json ./
RUN npm install
RUN npm ci --only=production

# Bundling app source
COPY . .

EXPOSE 3000
CMD ["npm", "start"]