const { BadRequestError } = require("../errors");
const supabase = require("../db/connect");

const getChat = async (req, res) => {
  const { roomId } = req.query;
  console.log(roomId);
  if (!roomId) {
    throw new BadRequestError("Please pass all fields");
  }
  const { data, error } = await supabase
    .from("chat")
    .select()
    .eq("roomId", roomId);
  if (error) {
    throw new Error("Error getting chat");
  }
  res.status(200).json({ data: data });
};

module.exports = {
  getChat,
};
