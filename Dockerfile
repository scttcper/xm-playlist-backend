FROM node:12-alpine

RUN mkdir -p /opt/app

WORKDIR /opt/app
COPY . /opt/app

RUN apk add --update-cache \
    python \
    python-dev \
    py-pip \
    build-base \
  && pip install virtualenv \
  && rm -rf /var/cache/apk/*

RUN npm ci
RUN npm run build
RUN npm cache clean --force

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

USER nextjs

ENV NODE_ENV production
ENV PORT 8080
EXPOSE 8080
CMD [ "node", "dist/src/server.js" ]
