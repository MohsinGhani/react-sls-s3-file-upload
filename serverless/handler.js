'use strict';
const { upload } = require("./controller/upload")


module.exports.upload = async (event, context) => {
  return upload(event, context);
}
