const mongoose = require("mongoose");

const NoPrefixSchema = new mongoose.Schema({
  userId: { type: String }
});

module.exports = mongoose.model("noPrefix", NoPrefixSchema);
