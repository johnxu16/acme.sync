FROM node:16

LABEL maintainer="John Xu <bringerxu@tom.com>"

RUN mkdir code

WORKDIR /code

COPY .npmrc package.json ./

RUN npm install

COPY src ./src

VOLUME [ "/data" ]

CMD ["node", "src/index.mjs"]
