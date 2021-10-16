FROM node:14.17
WORKDIR /app
COPY . .

RUN npm i \
  && node ace build --production \
  && cd build \
  && npm ci --production

EXPOSE 6002
CMD ["node", "server.js"]
