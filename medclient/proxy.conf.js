const protocol = 'http:',
  //host = '172.16.6.166:8080'; // стэнд телда
  host = '172.16.6.36:7533'; // стэнд Пнашина
  // host = '172.16.5.54:8080'; // стэнд нечай

  // host = '172.16.4.103:22226'; // стэнд тцмk
  // host = '37.26.236.126:8080'; // стэнд lastest


//  172 16 100 44: -|- 45 стэнды тцмк

const PROXY_CONFIG = {
  "/api/": {
    "target": `${protocol}//${host}`,
    "secure": false,
    "logLevel": "debug",
    "pathRewrite": {
      '/api/': '/tcmk/api/'
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
  "/endpoint/": {
    "target": `${protocol}//${host}`,
    "secure": false,
    "logLevel": "debug",
    "pathRewrite": {
      '/endpoint/': '/tcmk/endpoint/'
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

  "/geoserver": {
    "target": `http://172.16.6.166:8081`,
    "secure": false,
    "logLevel": "debug",
  }
  // "/geoserver": {
  //   "target": `http://192.168.11.131:8080`,
  //   "secure": false,
  //   "logLevel": "debug",
  // }
};

module.exports = PROXY_CONFIG;
/*host = '127.0.0.1:8080';*/
