const mongoose = require("mongoose");
const config = require("../config/dev");
const fakeDB = require("./FakeDB");

mongoose.connect(config.DB_URI, async () => {
  console.log("starting populating DB ...");
  await fakeDB.populate();
  await mongoose.connection.close();
  console.log("DB has been populated ...");
});
