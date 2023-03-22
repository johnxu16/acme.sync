### ACME SYNC

TL;DR

I've been used Traefik for a while as a ingress controller. It works like a charm.

However, one day a cloud provider sends me a message

> Here are some free amount of cdn quota, do you wanna use them?

I think why not.

With cdn, domains are actually pointed to cdn addresses so I have to configure ssl in the cloud provider for keeping them safe as well.

I checked out how much money I should pay to buy a wildcard ssl certificate.

Cannot afford it 😢

Choose to extract the let's encrypt ssl certificate files in the Traefik and upload them into different cloud services providers with their API.

##### What it does

1. Track down file "acme.json"
2. Extract cert from "acme.json"
3. Upload them into different cloud services providers

##### How to use it

###### docker
```bash
docker run -d --name acme -v $PWD/data:/data -e TENCENTCLOUD_SECRET_ID=tecent_secret_id -e TENCENTCLOUD_SECRET_KEY=secret_key -e ACME_RESOLVER=resolver jx77/acme
```

###### docker-compose
```yaml
version: '3.4'

services:
  acme:
    image: jx77/acme
    volumes:
      - {{ PATH }}:/data
    environment:
      - TENCENTCLOUD_SECRET_ID={{ tecent_secret_id }}
      - TENCENTCLOUD_SECRET_KEY={{ secret_key }}
      - ACME_RESOLVER={{ resolver }}
```
