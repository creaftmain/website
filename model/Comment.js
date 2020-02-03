/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const mongoose = require("mongoose");

/*=========================================================================================
VARIABLES
=========================================================================================*/

const Schema = mongoose.Schema;

/*=========================================================================================
CREATE COMMENT MODEL
=========================================================================================*/

const CommentSchema = new Schema({
  accountId: {
    type: Schema.Types.ObjectId
  },
  message: {
    type: String
  },
  date: {
    type: String
  },
  attachments: {
    type: [Schema.Types.ObjectId]
  }
});

/*=========================================================================================
EXPORT COMMENT MODEL
=========================================================================================*/

module.exports = Comment = mongoose.model("comment", CommentSchema);

/*=========================================================================================
END
=========================================================================================*/