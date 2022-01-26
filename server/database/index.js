const mongoose = require("mongoose");
const config = require("../config/dev");

require("./models/portfolio");

exports.connect = () => {
  //   mongoose.connect(config.DB_URI, () => {
  mongoose.connect(
    config.DB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useFindAndModify: false, // previous deprecation warning, but not working now
      // DeprecationWarning: Mongoose: 'findOneAndUpdate()' and 'findOneAndDelete()' without the 'useFindAndModify' option set to false are deprecated.
    },
    () => {
      console.log("connected to DB");
    }
  );
};
