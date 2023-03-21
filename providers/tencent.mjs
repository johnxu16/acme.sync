import tc from 'tencentcloud-sdk-nodejs';
import dbus from '../utils/dbus.mjs';

dbus.on("update", () => {
  console.log('Updated');
})

// 导入对应产品模块的client models。
const SSLClient = tc.ssl.v20191205.Client

const clientConfig = {
  credential: {
    secretId: process.env.TENCENTCLOUD_SECRET_ID,
    secretKey: process.env.TENCENTCLOUD_SECRET_KEY,
  },
  // 产品地域
  region: "ap-shanghai",
  // 可选配置实例
  profile: {
    signMethod: "HmacSHA256", // 签名方法
    httpProfile: {
      reqMethod: "POST", // 请求方法
      reqTimeout: 30, // 请求超时时间，默认60s
    },
  },
}

// const client = new SSLClient(clientConfig);

// (async () => {
//   const data = await client.DescribeCertificates();
//   console.log(data);
// })();
