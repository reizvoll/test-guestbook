import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import guestbookRoutes from './routes/guestbook';
import likesRoutes from './routes/likes';
import contentsRoutes from './routes/contents';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();
const port = process.env.PORT;

// CORS 설정
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/guestbook', guestbookRoutes);
app.use('/api/guestbook', likesRoutes);
app.use('/api/guestbook', contentsRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 