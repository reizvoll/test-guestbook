import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db';
import { RegisterBody, LoginBody, ApiResponse } from '../utils/types';

const router = express.Router();

// 회원가입
router.post('/register', async (req: Request<{}, {}, RegisterBody>, res: Response): Promise<void> => {
    const { id, password, nickname } = req.body;

    try {
        // 사용자명 중복 체크
        const usernameCheck = await pool.query(
            'SELECT id FROM users WHERE username = $1',
            [id]
        );
        if (usernameCheck.rows.length > 0) {
            res.status(409).json({ error: 'Username already exists' } as ApiResponse);
            return;
        }

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 10);

        // 사용자 생성
        const result = await pool.query(
            'INSERT INTO users (username, password, nickname) VALUES ($1, $2, $3) RETURNING id, username, nickname',
            [id, hashedPassword, nickname]
        );

        // 응답에서 민감한 정보 제거
        const { password: _, ...userWithoutPassword } = result.rows[0];
        res.status(201).json({
            message: 'User registered successfully',
            user: userWithoutPassword
        } as ApiResponse);
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' } as ApiResponse);
    }
});

// 로그인
router.post('/login', async (req: Request<{}, {}, LoginBody>, res: Response): Promise<void> => {
    const { id, password } = req.body;

    try {
        // 사용자 조회
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [id]
        );

        if (result.rows.length === 0) {
            res.status(401).json({ error: 'Invalid credentials' } as ApiResponse);
            return;
        }

        const user = result.rows[0];

        // 비밀번호 검증
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({ error: 'Invalid credentials' } as ApiResponse);
            return;
        }

        // JWT 토큰 생성
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // 응답에서 민감한 정보 제거
        const { password: _, ...userWithoutPassword } = user;
        res.json({
            token,
            user: userWithoutPassword
        } as ApiResponse);
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' } as ApiResponse);
    }
});

// 비밀번호 변경
router.patch('/change-password', async (req: Request<{}, {}, { username: string; currentPassword: string; newPassword: string }>, res: Response): Promise<void> => {
    const { username, currentPassword, newPassword } = req.body;

    try {
        // 사용자 조회
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'User not found' } as ApiResponse);
            return;
        }

        const user = result.rows[0];

        // 현재 비밀번호 검증
        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
            res.status(401).json({ error: 'Current password is incorrect' } as ApiResponse);
            return;
        }

        // 새 비밀번호 해싱 및 업데이트
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query(
            'UPDATE users SET password = $1 WHERE username = $2',
            [hashedPassword, username]
        );

        res.json({ message: 'Password updated successfully' } as ApiResponse);
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'Internal server error' } as ApiResponse);
    }
});

export default router; 