const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  // Campaign name
  name: {
    type: String,
    required: true,
    trim: true,
  },

  // Product this campaign belongs to
  product: {
    type: String,
    required: true,
    trim: true,
  },

  // Notification message
  message: {
    type: String,
    required: true,
    trim: true,
  },

  // Locations where campaign should be shown
  locations: {
    type: [String],
    default: [],
  },

  // Campaign priority
  // Higher number = higher priority
  priority: {
    type: Number,
    default: 1,
  },

  // Maximum notifications per visitor
  frequencyLimit: {
    type: Number,
    default: 3,
  },

  // Delay before notification appears
  delay: {
    type: Number,
    default: 0,
  },

  // Campaign status
  active: {
    type: Boolean,
    default: true,
  },

  // Campaign start
  startDate: {
    type: Date,
    default: Date.now,
  },

  // Campaign end
  endDate: {
    type: Date,
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Campaign = mongoose.model("Campaign", campaignSchema);

module.exports = Campaign;
