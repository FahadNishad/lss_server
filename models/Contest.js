const mongoose = require('mongoose');

const ContestSchema = new mongoose.Schema({
    ContestName: { type: String, required: true }, // Enforcing uniqueness on ContestName
    TopTeamLabel: { type: String, required: true },
    LeftTeamLabel: { type: String, required: true },
    square: { type: Number, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true }, // Not unique, multiple contests can be created with the same email
    rules: { type: String },
    paymentMethod: { type: String },
    PlayerPassword: { type: String, required: true },
    contextImage: { type: String },
    prizeInfo: { type: String }
});

module.exports = mongoose.model('Contest', ContestSchema);
