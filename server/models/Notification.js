const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    default: null,
  },

  name: {
    type: String,
    required: true,
  },

  location: {
    type: String,
    required: true,
  },

  product: {
    type: String,
    required: true,
  },

  message: {
    type: String,
    required: true,
  },

  time: {
    type: String,
    default: "just now",
  },

  impressions: {
    type: Number,
    default: 0,
  },

  clicks: {
    type: Number,
    default: 0,
  },

  conversions: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
