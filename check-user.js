import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: './backend/.env' });

const UserSchema = new mongoose.Schema({
  email: String,
  firstName: String
});

const User = mongoose.model('User', UserSchema);

async function checkUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    
    const user = await User.findOne({ email: "swati123@gmail.com" });
    if (user) {
      console.log("USER_FOUND:", JSON.stringify(user));
    } else {
      console.log("USER_NOT_FOUND");
    }
    
    process.exit(0);
  } catch (err) {
    console.error("ERROR:", err);
    process.exit(1);
  }
}

checkUser();
