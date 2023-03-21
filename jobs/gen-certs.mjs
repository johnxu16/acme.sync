import { $ } from 'zx';
import fs from 'fs-extra';
import path from 'path';
import md5 from 'md5';
import dbus from '../utils/dbus.mjs';

const isProduction = process.env.MODE === "production";

const ACME_PATH = isProduction ? "/data/acme.json" : "./data/acme.json";
const ACME_RESOLVER = process.env.ACME_RESOLVER;

const rawJSON = (await fs.readFile(ACME_PATH)).toString();
const JsObj = JSON.parse(rawJSON);
const { Certificates, Account: { PrivateKey } } = JsObj[ACME_RESOLVER];

const pdir = path.resolve("/data", "private");
const cdir = path.resolve("/data", "certs");

function normalizePath(path) {
  return path.replace("*", "_");
}

function isSame() {
  console.log(global.FILE_DIGEST);
  const digest = md5(rawJSON);
  if(!global.FILE_DIGEST) {
    global.FILE_DIGEST = digest;
    return false;
  }
  return digest === global.FILE_DIGEST;
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

export async function run() {
  if (isSame()) return;
  await generateLetsEncryptKey();
  await generateDomainsCerts();
  dbus.emit("update");
}