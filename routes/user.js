const express = require("express");
const router = express.Router();
const { searchUsers } = require("../controllers/user");

router.route("/searchUsers").post(searchUsers);

module.exports = router;
