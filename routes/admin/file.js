/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const express = require("express");
const path = require("path");
const passport = require("passport");

/*=========================================================================================
VARIABLES
=========================================================================================*/

const router = new express.Router();
const routeOptions = {
  root: path.join(__dirname, "./../../views/admin")
};

/*=========================================================================================
MODELS
=========================================================================================*/

const Image = require("../../model/Image.js");

/*=========================================================================================
MIDDLEWARE
=========================================================================================*/

const adminAccess = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
};

const upload = require("../../config/upload.js");

/*=========================================================================================
ROUTES
=========================================================================================*/

// @route     Get /admin/file/upload
// @desc
// @access    Admin
router.post("/admin/file/upload", upload.single("file"), async (req, res) => {
  // Declare Variable
  const file = req.file;
  // Add an Image Document
  const image = new Image({
    file: {
      id: file._id,
      name: file.filename
    }
  });
  try {
    await image.save();
  } catch (error) {
    return res.send({ status: "failed", content: error });
  }
  // Send Successful Response
  return res.send({ status: "succeeded", content: "file uploaded" });
});

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/