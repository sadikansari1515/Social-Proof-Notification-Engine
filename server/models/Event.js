const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },

  name: String,

  location: String,

  product: String,

  notificationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Notification",
  },

  sessionId: String,

  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
