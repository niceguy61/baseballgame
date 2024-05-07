const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const http = require('http');
const socketIo = require('socket.io');
require('./config/passport');

// MongoDB 설정
const mongoURL = process.env.MONGO_URL || 'mongodb://localhost/baseball-game';
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
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

// 인증 및 경로
app.use(passport.initialize());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/games', require('./routes/games')(io));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/teams', require('./routes/teams'));

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Backend server running on port ${port}`));
