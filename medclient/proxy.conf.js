const protocol = 'http:',
  host = '172.16.6.166:8080'; // стэнд телда
  hostWs = '172.16.6.166'; // стэнд телда

const PROXY_CONFIG = {
  "/": {
    "target": `${protocol}//${host}`,
    "secure": false,
    "logLevel": "debug",
    "pathRewrite": {
      '/': '/tcmk/'
    },
    "bypass": function (req, res) {
      req.headers["origin"] = this.target;
      req.headers["host"] = host;
    },
    onProxyRes(proxyRes, req, res) {
      // rewrite set-cookies path
      if (proxyRes.headers['set-cookie']) {
        proxyRes.headers['set-cookie'] = proxyRes.headers['set-cookie'].map(setCookie => {
           return setCookie.replace('Path=/tcmk', 'Path=/');
          // return setCookie;
        });
      }
    }
  },
  "/tcmk/api/stomp": {
    "target": `ws://${hostWs}`,
    "secure": false,
    "ws": true,
    "logLevel": "debug",
  }
};

module.exports = PROXY_CONFIG;
/*host = '127.0.0.1:8080';*/
