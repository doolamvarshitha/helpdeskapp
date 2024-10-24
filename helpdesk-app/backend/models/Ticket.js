const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: {
    type: String,
    enum: ["Active", "Pending", "Closed"],
    default: "Active",
  },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lastUpdatedOn: { type: Date, default: Date.now },
  notes: [
    {
      addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Ticket", ticketSchema);
