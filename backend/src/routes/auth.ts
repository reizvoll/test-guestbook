import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db';
import { RegisterBody, LoginBody, ApiResponse, ChangePasswordBody } from '../utils/types';

const router = express.Router();

// 회원가입
router.post('/register', async (req: Request<{}, {}, RegisterBody>, res: Response): Promise<void> => {
    try {
        const { email, password, nickname } = req.body;

        const emailCheck = await pool.query('SELECT email FROM users WHERE email = $1', [email]);
        if (emailCheck.rows.length > 0) {
            res.status(409).json({ error: 'Email already exists' } as ApiResponse);
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (email, password, nickname) VALUES ($1, $2, $3) RETURNING id, email, nickname',
            [email, hashedPassword, nickname]
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
    const { email, password } = req.body;

    try {
        // 사용자 조회
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
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
            { user_id: user.id, nickname: user.nickname },
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
router.patch('/change-password', async (req: Request<{}, {}, ChangePasswordBody>, res: Response): Promise<void> => {
    const { email, currentPassword, newPassword } = req.body;

    try {
        // 사용자 조회 (email 기준)
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'User not found' } as ApiResponse);
            return;
        }

        const user = result.rows[0];

        // 비밀번호 검증
        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
            res.status(401).json({ error: 'Current password is incorrect' } as ApiResponse);
            return;
        }

        // 새 비밀번호 해싱 및 업데이트
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query(
            'UPDATE users SET password = $1 WHERE email = $2',
            [hashedPassword, email]
        );

        res.json({ message: 'Password updated successfully' } as ApiResponse);
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'Internal server error' } as ApiResponse);
    }
});

export default router; 