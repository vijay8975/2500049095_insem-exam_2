require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("./models/admin");

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const username = process.env.ADMIN_USERNAME;
        const password = process.env.ADMIN_PASSWORD;

        if (!username || !password) {
            throw new Error("Admin credentials are missing in .env");
        }

        const existing = await Admin.findOne({ username });

        if (existing) {
            console.log("Admin already exists!");
        } else {
            const passwordHash = await bcrypt.hash(password, 12);

            await Admin.create({ username, passwordHash });

            console.log("Admin account created successfully!");
        }
    } catch (err) {
        console.log(err.message);
    } finally {
        await mongoose.disconnect();
    }
}

createAdmin();