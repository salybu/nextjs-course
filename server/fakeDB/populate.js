const mongoose = require("mongoose");
const config = require("../config/dev");

mongoose.connect(config.DB_URI, () => {
  console.log("populating DB ..........");
  console.log("connected to DB");
});
