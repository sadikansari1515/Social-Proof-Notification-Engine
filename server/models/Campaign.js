const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({

    // ========================================
    // Campaign Owner
    // ========================================

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    product: {
        type: String,
        required: true,
        trim: true
    },

    message: {
        type: String,
        required: true,
        trim: true
    },

    locations: {
        type: [String],
        default: []
    },

    active: {
        type: Boolean,
        default: true
    },

    priority: {
        type: Number,
        default: 1
    },

    weight: {
        type: Number,
        default: 1,
        min: 1
    },

    frequencyLimit: {
        type: Number,
        default: 3
    },

    delay: {
        type: Number,
        default: 0
    },

    cooldown: {
        type: Number,
        default: 30
    },

    startDate: {
        type: Date,
        default: Date.now
    },

    endDate: {
        type: Date,
        default: null
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

const Campaign =
    mongoose.model("Campaign", campaignSchema);

module.exports = Campaign;