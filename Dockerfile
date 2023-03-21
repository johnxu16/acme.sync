FROM node:16

LABEL maintainer="John Xu <bringerxu@tom.com>"

RUN mkdir code

WORKDIR /code

COPY .npmrc package.json ./

RUN pnpm install

COPY index.mjs /index.mjs

VOLUME [ "/data" ]

ENTRYPOINT [ "npm", "run", "start" ]

CMD = [""]
