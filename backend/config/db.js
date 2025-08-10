require('dotenv').config();
const mongoose = require('mongoose');

const dbPath = process.env.MONGO_URI;

if (!dbPath) {
    console.error("❌ MONGO_URI is missing. Check your .env file.");
    process.exit(1);
}

const connectDb = async () => {
    try {
        await mongoose.connect(dbPath, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000, // Increase timeout
        });

        console.log("✅ Database connected successfully");
    } catch (err) {
        console.error("❌ Error connecting to the database:", err);
        process.exit(1); // Exit if database fails
    }
};

module.exports = connectDb;