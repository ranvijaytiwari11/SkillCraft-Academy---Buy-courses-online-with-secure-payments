import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesToDownload = [
  { url: "https://i.ytimg.com/vi/EAR7De6GOMA/hqdefault.jpg", filename: "striver.jpg" },
  { url: "https://i.ytimg.com/vi/b5cg_kR-uGE/hqdefault.jpg", filename: "raghav.jpg" },
  { url: "https://i.ytimg.com/vi/HcOc7P5BMi4/hqdefault.jpg", filename: "shradha.jpg" },
  { url: "https://i.ytimg.com/vi/WQoB2z67hvY/hqdefault.jpg", filename: "love.jpg" },
  { url: "https://i.ytimg.com/vi/vGjAArIyoe4/hqdefault.jpg", filename: "harkirat.jpg" },
  { url: "https://i.ytimg.com/vi/bMknfKXIFA8/hqdefault.jpg", filename: "hitesh.jpg" },
  { url: "https://i.ytimg.com/vi/UrsmFxEIp5k/hqdefault.jpg", filename: "harry.jpg" },
  { url: "https://i.ytimg.com/vi/aYITXw6X1s8/hqdefault.jpg", filename: "anuj.jpg" },
  { url: "https://i.ytimg.com/vi/rZ41y93P2Qo/hqdefault.jpg", filename: "kunal.jpg" },
  { url: "https://i.ytimg.com/vi/HwU4qS3_32w/hqdefault.jpg", filename: "nishant.jpg" },
  { url: "https://i.ytimg.com/vi/z01BwIBQe2M/hqdefault.jpg", filename: "saurabh.jpg" },
  // -> Extended faculty asset endpoints
  { url: "https://i.ytimg.com/vi/pN6jk0uUrD8/hqdefault.jpg", filename: "akshay.jpg" },
  { url: "https://i.ytimg.com/vi/ZjAqacIC_3c/hqdefault.jpg", filename: "piyush.jpg" },
  { url: "https://i.ytimg.com/vi/EHTWMpD6S_0/hqdefault.jpg", filename: "thapa.jpg" },
  { url: "https://i.ytimg.com/vi/eIrMbAQSU34/hqdefault.jpg", filename: "telusko.jpg" }
];

const main = async () => {
  const dirPath = path.join(__dirname, "../frontend/public/course-images");
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

  console.log("Starting reliable image downloads using native fetch...");
  let count = 0;
  
  for (const img of imagesToDownload) {
    const fullPath = path.join(dirPath, img.filename);
    try {
      const response = await fetch(img.url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(fullPath, buffer);
      
      console.log(`✅ Downloaded reliably: ${img.filename}`);
      count++;
    } catch (err) {
      console.error(`❌ Failed to download ${img.filename}:`, err.message);
      // -> Initiating graceful fallback to generic unsplash asset on primary failure
      try {
        const fbRes = await fetch("https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800");
        const fbBuffer = Buffer.from(await fbRes.arrayBuffer());
        fs.writeFileSync(fullPath, fbBuffer);
        console.log(`⚠️ Used Generic Fallback image for: ${img.filename}`);
      } catch (e) {
          console.log("Completely failed.");
      }
    }
  }
  
  console.log(`\n🎉 Processed 11 images to local disk!`);
};

main();
