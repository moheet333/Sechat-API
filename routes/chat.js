const express = require("express");
const router = express.Router();
const { getChat } = require("../controllers/chat");

router.route("/getChat").get(getChat);

module.exports = router;
