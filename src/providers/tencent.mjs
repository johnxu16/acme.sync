import * as dotenv from 'dotenv';
dotenv.config();

import tc from 'tencentcloud-sdk-nodejs';
import dbus from '../utils/dbus.mjs';

const SSLClient = tc.ssl.v20191205.Client

const clientConfig = {
  credential: {
    secretId: process.env.TENCENTCLOUD_SECRET_ID,
    secretKey: process.env.TENCENTCLOUD_SECRET_KEY,
  },
  region: "ap-shanghai",
  profile: {
    signMethod: "HmacSHA256",
    httpProfile: {
      reqMethod: "POST",
      reqTimeout: 30,
    },
  },
}

const client = new SSLClient(clientConfig);

(async () => {
  dbus.on("update", async (publicKey, pirvateKey) => {
    console.log(`ACME file updated`);
    const res = await client.DescribeCertificates();
    const ACME_RESOLVER = process.env.ACME_RESOLVER;
    const targetCert = res.Certificates.find(_ => _.Alias === ACME_RESOLVER);
    const certId = targetCert.CertificateId;
    if(certId) await client.DeleteCertificate({ CertificateId: certId });
    const uploadRes = await client.UploadCertificate({
      CertificatePublicKey: publicKey,
      CertificatePrivateKey: pirvateKey,
      CertificateType: "SVR",
      Repeatable: true,
      Alias: ACME_RESOLVER,
      ProjectId: '0',
    });
    console.log(uploadRes);
  })
})();
