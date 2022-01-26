const mongoose = require("mongoose");
const config = require("../config/dev");

require("./models/portfolio");
require("./models/user");

exports.connect = () => {
  //   mongoose.connect(config.DB_URI, () => {
  mongoose.connect(
    config.DB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useFindAndModify: false, // previous deprecation warning, but not working now
      // DeprecationWarning: Mongoose: 'findOneAndUpdate()' and 'findOneAndDelete()' without the 'useFindAndModify' option set to false are deprecated.
      // useCreateIndex: true // previous deprecation
      // DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead (mongoose user model index: true property)
    },
    () => {
      console.log("connected to DB");
    }
  );
};
