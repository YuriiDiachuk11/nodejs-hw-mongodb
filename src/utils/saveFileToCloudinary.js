import cloudinary from 'cloudinary';
import fs from 'node:fs/promises';
import { CLOUDINARY } from '../constants/index.js';

cloudinary.v2.config({
  secure: true,
  cloud_name: CLOUDINARY.CLOUD_NAME,
  api_key: CLOUDINARY.API_KEY,
  api_secret: CLOUDINARY.API_SECRET,
});

export const saveFileToCloudinary = async (file) => {
  console.log('Uploading to Cloudinary:', file.path);
  const response = await cloudinary.uploader.upload(file.path);
  await fs.unlink(file.path);
  return response.secure_url;
};
