const mongoose = require('mongoose');

const blacklistTokenSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
    blacklistedAt: { type: Date, default: Date.now, expires: 86400 } // 24 hours TTL
});

module.exports = mongoose.model('BlacklistToken', blacklistTokenSchema);