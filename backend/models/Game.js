// backend/models/Game.js
const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: true },
    scoreboard: {
        home: { type: Number, default: 0 },
        away: { type: Number, default: 0 }
    },
    outCount: { type: Number, default: 0 },
    inning: { type: Number, default: 1 },
    // 투구 기록과 리액션
    logs: [{ type: String }],
    // 날짜 및 관리자 정보
    date: { type: Date, default: Date.now },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Game', GameSchema);
