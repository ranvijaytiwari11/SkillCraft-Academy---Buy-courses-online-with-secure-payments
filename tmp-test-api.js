const https = require('https');

const options = {
  hostname: 'skill-craft-academy-buy-courses-onl.vercel.app',
  port: 443,
  path: '/_/backend/ping',
  method: 'GET',
};

const req = https.request(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('STATUS:', res.statusCode, 'DATA:', data));
});
req.on('error', console.error);
req.end();
