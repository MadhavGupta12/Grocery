import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/user.model.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for admin seeding...");

    const email = "gmadhav024@gmail.com";
    const password = "Madhav123";
    const hashedPassword = await bcrypt.hash(password, 10);

    let adminUser = await User.findOne({ email });

    if (adminUser) {
      console.log("Admin user already exists. Updating role and password...");
      adminUser.role = "admin";
      adminUser.password = hashedPassword;
      await adminUser.save();
      console.log("Admin user updated successfully.");
    } else {
      console.log("Admin user not found. Creating new admin user...");
      adminUser = new User({
        name: "Madhav Admin",
        email: email,
        password: hashedPassword,
        role: "admin"
      });
      await adminUser.save();
      console.log("Admin user created successfully.");
    }

    mongoose.disconnect();
    console.log("Done.");
  } catch (error) {
    console.error("Error seeding admin:", error);
    mongoose.disconnect();
  }
};

seedAdmin();
