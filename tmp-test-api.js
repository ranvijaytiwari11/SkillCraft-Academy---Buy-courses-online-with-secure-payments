const https = require('https');

const data = JSON.stringify({
  firstName: "Test2",
  lastName: "User2",
  email: "random_not_existing_mail_fjasdk2@gmail.com",
  password: "password123"
});

const options = {
  hostname: 'skill-craft-academy-buy-courses-onl.vercel.app',
  port: 443,
  path: '/_/backend/api/v1/user/signup',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = https.request(options, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log('STATUS:', res.statusCode, '\nBODY:', body));
});

req.on('error', error => console.error(error));
req.write(data);
req.end();
