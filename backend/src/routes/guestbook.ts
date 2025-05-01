import express, { Request, Response } from 'express';
import pool from '../db';
import { GuestbookParams, GuestbookCreateBody, ApiResponse } from '../utils/types';

const router = express.Router();

// 방명록 목록 조회
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('Fetching guestbook entries...');
        const result = await pool.query(
            'SELECT * FROM guestbook ORDER BY created_at DESC'
        );
        console.log('Guestbook entries fetched successfully:', result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching guestbook entries:', error);
        res.status(500).json({ error: 'Internal server error' } as ApiResponse);
    }
});

// 방명록 작성
router.post('/', async (req: Request<{}, {}, GuestbookCreateBody>, res: Response): Promise<void> => {
    const { user_id, user_nickname, contents } = req.body;
    
    try {
        // 비로그인 유저의 경우 랜덤 ID와 Guest 닉네임 생성
        const isGuest = !user_id;
        const finalUserId = user_id || Math.floor(1000 + Math.random() * 9000); // 1000~9999 사이의 랜덤 숫자
        const finalNickname = user_nickname || `Guest${String(finalUserId).padStart(4, '0')}`; // 4자리 숫자로 패딩

        const result = await pool.query(
            'INSERT INTO guestbook (user_id, is_guest, user_nickname, contents) VALUES ($1, $2, $3, $4) RETURNING *',
            [isGuest ? null : finalUserId, isGuest, finalNickname, contents]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating guestbook entry:', error);
        res.status(500).json({ error: 'Internal server error' } as ApiResponse);
    }
});

// 방명록 수정
router.put('/:id', async (req: Request<GuestbookParams, {}, { contents: string }>, res: Response): Promise<void> => {
    const { id } = req.params;
    const { contents } = req.body;

    try {
        const result = await pool.query(
            'UPDATE guestbook SET contents = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
            [contents, id]
        );
        
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Guestbook entry not found' } as ApiResponse);
            return;
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating guestbook entry:', error);
        res.status(500).json({ error: 'Internal server error' } as ApiResponse);
    }
});

// 좋아요 업데이트
router.put('/:id/like', async (req: Request<GuestbookParams>, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'UPDATE guestbook SET likes = likes + 1 WHERE id = $1 RETURNING *',
            [id]
        );
        
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Guestbook entry not found' } as ApiResponse);
            return;
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating likes:', error);
        res.status(500).json({ error: 'Internal server error' } as ApiResponse);
    }
});

// 방명록 삭제
router.delete('/:id', async (req: Request<GuestbookParams>, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM guestbook WHERE id = $1 RETURNING *',
            [id]
        );
        
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Guestbook entry not found' } as ApiResponse);
            return;
        }
        
        res.json({ message: 'Guestbook entry deleted successfully' } as ApiResponse);
    } catch (error) {
        console.error('Error deleting guestbook entry:', error);
        res.status(500).json({ error: 'Internal server error' } as ApiResponse);
    }
});

export default router; 