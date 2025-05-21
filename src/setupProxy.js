const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://admin.hlx.page',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
      secure: false,
      onProxyReq: (proxyReq, req, res) => {
        const authToken = req.headers['x-auth-token'];
        const aemToken = req.headers['x-content-source-authorization'];
        
        if (authToken) {
          proxyReq.setHeader('x-auth-token', authToken);
        }
        if (aemToken) {
          proxyReq.setHeader('x-content-source-authorization', aemToken);
        }
      },
      onProxyRes: (proxyRes, req, res) => {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      }
    })
  );
}; 