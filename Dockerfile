FROM node:20.11.0-alpine

# We are in the app directory
WORKDIR /app

# We will copy package json there
COPY package.json package.json

RUN npm install
# RUN npm ci --only=production

COPY . .

EXPOSE 4000

CMD [ "npm", "run", "start" ]