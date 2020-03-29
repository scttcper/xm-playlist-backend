FROM node:13-alpine

RUN mkdir -p /opt/app
RUN apk add --no-cache libc6-compat
ENV NODE_ENV production
ENV PORT 8080
EXPOSE 8080

WORKDIR /opt/app

COPY package.json /opt/app
COPY package-lock.json /opt/app

RUN npm ci

COPY . /opt/app

RUN npm run build

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

USER nextjs

CMD [ "node", "dist/src/server.js" ]
