FROM node:16

LABEL maintainer="John Xu <bringerxu@tom.com>"

RUN mkdir code

WORKDIR /code

COPY .npmrc package.json ./

RUN pnpm install

COPY index.mjs jobs ./

VOLUME [ "/data" ]

CMD = ["node", "index.mjs"]
