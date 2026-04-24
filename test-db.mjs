import mongoose from 'mongoose';
import { readFileSync } from 'fs';

// simple script to parse .env.local manually and test connection
try {
  const envFile = readFileSync('.env.local', 'utf8');
  const match = envFile.match(/MONGODB_URI=["']?([^"'\n]+)["']?/);
  const uri = match ? match[1] : null;

  if (!uri) {
    console.error("❌ MONGODB_URI not found in .env.local");
    process.exit(1);
  }

  console.log("Attempting to connect to MongoDB...");
  console.log(`URI starts with: ${uri.substring(0, 15)}...`);

  mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
      console.log("✅ Successfully connected to MongoDB!");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error:");
      console.error(err.message);
      if (err.message.includes('bad auth')) {
        console.error("👉 Hint: Your username or password in the URI is incorrect.");
      } else if (err.message.includes('IP')) {
        console.error("👉 Hint: Your IP address is not whitelisted in MongoDB Atlas.");
      }
      process.exit(1);
    });
} catch (err) {
  console.error("Error reading .env.local:", err.message);
  process.exit(1);
}
