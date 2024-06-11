const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const { encrypt, decrypt } = require('./utils/encryption');
const uploadRoutes = require('./routes/upload');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.json());
app.use(express.static('public'));
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('joinRoom', (room) => {
        socket.join(room);
    });

    socket.on('chatMessage', (msg) => {
        // Process the message (e.g., save to database)
        console.log('Received message:', msg);
        // Broadcast the message to all clients in the room
        io.to(msg.room).emit('message', msg);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Chat Application');
});

server.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.port || 3000}`);
});