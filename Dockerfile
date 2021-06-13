FROM node:14.17 as builder
WORKDIR /app
COPY .env.example ./.env
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN rm build/.env

FROM node:14.17
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/build ./
COPY package*.json ./
RUN npm ci
RUN node ace generate:manifest
EXPOSE 6002
CMD [ "node", "server.js" ]
