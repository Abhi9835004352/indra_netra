import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/authRoutes.js';
import { createGateRoutes } from './routes/gateRoutes.js';
import { createCrowdRoutes } from './routes/crowdRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import inferenceRoutes from './routes/inferenceRoutes.js';
import { setupCameraWebSocket } from './websocket/cameraHandler.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// MongoDB Connection
mongoose
    .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/indra_netra')
    .then(() => {
        console.log('✅ MongoDB connected');
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
    });

// WebSocket Connection
io.on('connection', (socket) => {
    console.log('✅ User connected:', socket.id);

    socket.on('join_crowd_monitoring', (eventId) => {
        socket.join(`crowd-${eventId}`);
        console.log(`User ${socket.id} joined crowd monitoring for event ${eventId}`);
    });

    socket.on('leave_crowd_monitoring', (eventId) => {
        socket.leave(`crowd-${eventId}`);
        console.log(`User ${socket.id} left crowd monitoring for event ${eventId}`);
    });

    socket.on('disconnect', () => {
        console.log('❌ User disconnected:', socket.id);
    });
});

// Setup camera WebSocket namespace
setupCameraWebSocket(io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/gate', createGateRoutes(io));
app.use('/api/crowd', createCrowdRoutes(io));
app.use('/api/events', eventRoutes);
app.use('/api/inference', inferenceRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: '✅ Backend is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5001;
httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

export default httpServer;
