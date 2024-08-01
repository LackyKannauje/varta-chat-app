const mongoose = require("mongoose");

connectToDatabase = async (url) => {
  try {
    await mongoose
      .connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("MongoDB connected"))
      .catch((err) => console.log(err));
  } catch (error) {
    console.log(error);
  }
};

module.exports = { connectToDatabase };
