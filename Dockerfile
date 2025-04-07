FROM node:20.11.0-alpine as builder

# We are in the app directory
WORKDIR /app

# We will copy package json there
COPY package.json package.json

RUN npm install

COPY . .

RUN npm run build

# Final stage: runtime
FROM node:20.11.0-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/package.json ./package.json

COPY --from=builder /app/node_modules ./node_modules

EXPOSE 4000

CMD ["npm", "run", "serve"]
