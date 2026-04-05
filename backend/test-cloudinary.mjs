import { v2 as cloudinary } from 'cloudinary';

import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

async function run() {
  try {
    const res = await cloudinary.uploader.upload('https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg', {
      folder: 'test'
    });
    console.log('UPLOAD SUCCESS:', res.secure_url);
  } catch (err) {
    console.error('UPLOAD ERROR:', err);
  }
}
run();
