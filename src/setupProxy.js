const { createProxyMiddleware } = require('http-proxy-middleware');


module.exports = function(app) {
 app.use(
   '/api',
   createProxyMiddleware({
     target: 'http://localhost:3001',
     changeOrigin: true,
     secure: false,
     pathRewrite: {'^/api': ''},
     onProxyReq: (proxyReq, req, res) => {
       proxyReq.setHeader('Origin', 'http://localhost:3001');
     }
   })
 );
};
