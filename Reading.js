const mongoose = require("mongoose");

const readingSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now, index: true },
  temperature: Number,
  ph: Number,
  co2: Number,
  dissolvedOxygen: Number,
  turbidity: Number,
  algaeHealth: Number,
});

module.exports = mongoose.model("Reading", readingSchema);
