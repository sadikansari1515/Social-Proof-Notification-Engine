const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({

    sessionId: {
        type: String,
        required: true,
        unique: true
    },

    location: {
        type: String,
        default: "Unknown"
    },

    socketId: {
        type: String,
        required: true
    },

    online: {
        type: Boolean,
        default: true
    },

    lastSeen: {
        type: Date,
        default: Date.now
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

const Visitor =
    mongoose.model("Visitor", visitorSchema);

module.exports = Visitor;