const mongoose = require("mongoose");
const configureDB = async () => {
  const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017";
  const dbName = process.env.DB_NAME || "quiz-app";
  try {
    await mongoose.connect(`${dbUrl}/${dbName}`);
    console.log("Connected to db", dbName);
  } catch (e) {
    console.log("error connecting to db", e.message);
  }
};
module.exports=configureDB