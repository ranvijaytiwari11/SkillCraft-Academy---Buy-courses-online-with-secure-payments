import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dfknhavaz',
  api_key: '869658567234291',
  api_secret: 'bqmrQTKRolnhnE136ex3S2yXApY'
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
