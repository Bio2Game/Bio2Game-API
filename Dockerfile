FROM node:16.13 as builder
WORKDIR /app

COPY package.json yarn.lock ./

RUN npm set-script prepare ""
RUN yarn install

COPY . .

RUN node ace build --production \
  && cd build \
  && npm set-script prepare "" \
  && yarn install --frozen-lockfile

FROM node:16.13
WORKDIR /app

COPY --from=builder /app/build .

EXPOSE 6002
CMD ["node", "server.js"]
