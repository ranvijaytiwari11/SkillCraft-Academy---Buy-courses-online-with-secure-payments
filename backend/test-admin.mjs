import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const adminSchema = new mongoose.Schema({ email: String, password: String });
const Admin = mongoose.model("ADMIN", adminSchema);

async function findAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  const admin = await Admin.findOne();
  console.log("Found admin email:", admin?.email);
  process.exit(0);
}
findAdmin();
