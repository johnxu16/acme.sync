#!/usr/bin/env node
import { $ } from 'zx';
import fs from 'fs-extra';
import path from 'path';
import md5 from 'md5';

const FILE_DIGEST = "";

const rawJSON = (await fs.readFile("./data/acme.json")).toString();
const JsObj = JSON.parse(rawJSON);
const { Certificates, Account: { PrivateKey } } = JsObj.lx;

const pdir = path.resolve("/data", "private");
const cdir = path.resolve("/data", "certs");

function normalizePath(path) {
  return path.replace("*", "_");
}

function isSame() {
  const digest = md5(rawJSON);
  return digest === FILE_DIGEST;
}

async function generateLetsEncryptKey() {
  const letsencryptkey = `-----BEGIN RSA PRIVATE KEY-----\n${PrivateKey}\n-----END RSA PRIVATE KEY-----`
  const p = path.resolve(pdir, 'letsencryptkey')
  await fs.createFile(p);
  await $`echo -e ${letsencryptkey} | openssl rsa -inform pem -out ${p} > /dev/null`
}

async function generateDomainsCerts() {
  Certificates.forEach(async (cert) => {
    const { domain: { main }, certificate, key } = cert;
    console.log(`Extracting cert bundle for ${main}`);
    const _main = normalizePath(main)
    const p = path.resolve(cdir, _main);

    const crtData = await $`echo ${certificate} | base64 -d`;
    const keyData = await $`echo ${key} | base64 -d`;

    await fs.createFile(path.resolve(p, _main + '.crt'));
    await fs.createFile(path.resolve(p, _main + '.key'));
    await fs.writeFile(path.resolve(p, _main + '.crt'), crtData.stdout);
    await fs.writeFile(path.resolve(p, _main + '.key'), keyData.stdout);
  })
}

async function run() {
  if (isSame()) return;
  await generateLetsEncryptKey();
  await generateDomainsCerts();
}

(async () => {
  await run();
})();