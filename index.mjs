#!/usr/bin/env zx
import fs from 'fs/promises';

const rawJSON = (await fs.readFile("./data/acme.json")).toString();
const JsObj = JSON.parse(rawJSON);
const { Certificates, Account: { PrivateKey } } = JsObj.lx;

const letsencryptkey = `-----BEGIN RSA PRIVATE KEY-----\n${PrivateKey}\n-----END RSA PRIVATE KEY-----`
// await $`${letsencryptkey} | openssl rsa -inform pem -out ${__dirname}/data/letsencryptkey`
await $`echo ${letsencryptkey} | openssl rsa -inform pem -out /data/letsencryptkey`

// await $`cat package.json | grep name`

// let branch = await $`git branch --show-current`
// await $`dep deploy --branch=${branch}`

// await Promise.all([
//   $`sleep 1; echo 1`,
//   $`sleep 2; echo 2`,
//   $`sleep 3; echo 3`,
// ])

// let name = 'foo bar'
// await $`mkdir /tmp/${name}`