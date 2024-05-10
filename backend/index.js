const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const { checkAndCreateGame } = require('./gameScheduler');
const { generateEvent } = require('./utils/gameEventGenerator');
require('./config/passport');
const { initializeDefaultGachaSet } = require('./controllers/gachaController');
const userRoutes = require('./routes/userRoutes');
const gachaRoutes = require('./routes/gachaRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');

// MongoDB 설정
const mongoURL = process.env.MONGO_URL || 'mongodb://localhost/baseball-game';
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.use(bodyParser.json());
app.use(morgan('dev'));

// CORS 허용 설정
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 인증 및 경로
const gamesRouter = require('./routes/games')(io);
app.use(passport.initialize());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/games', gamesRouter);
app.use('/api/stats', require('./routes/stats'));
app.use('/api/teams', require('./routes/teams'));
app.use('/api/players', require('./routes/players'));
app.use('/api/users', userRoutes);
app.use('/api/gacha', gachaRoutes);
app.use('/api/inventory', inventoryRoutes);

const port = process.env.PORT || 5000;
server.listen(port, async () => {
  console.log(`Backend server running on port ${port}`);
  await initializeDefaultGachaSet();
});

// 주기적으로 게임 확인 및 이벤트 생성
setInterval(checkAndCreateGame, 10000); // 1분 간격으로 게임 생성 여부 확인
generateEvent(io);
