FROM node:16

WORKDIR /

LABEL maintainer="John Xu <bringerxu@tom.com>"

RUN npm i -g zx

COPY index.mjs /index.mjs

VOLUME [ "/data" ]

ENTRYPOINT [ "zx", "index.mjs" ]

CMD = [""]

