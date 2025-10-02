const mongoose = require("mongoose");

const connectWithDB = () => {
  mongoose.set("strictQuery", false);

  if (process.env.NODE_ENV === 'test') {
    // Mock Mongoose connection for testing
    console.log("Mocking DB connection for test environment");
    mongoose.connect = jest.fn(() => Promise.resolve());
    mongoose.connection = { close: jest.fn(() => Promise.resolve()) };
    return;
  }

  const dbUrl = process.env.DB_URL;
  console.log("Connecting to DB with URL:", dbUrl); // Vérification de DB_URL

  if (!dbUrl) {
    console.error("DB_URL is not defined in the environment variables");
    process.exit(1);
  }

  mongoose
    .connect(dbUrl)
    .then(() => {
      console.log("DB connected successfully");
    })
    .catch((err) => {
      console.log("DB connection failed");
      console.log(err);
      process.exit(1);
    });
};

module.exports = connectWithDB;
