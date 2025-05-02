import express, { Request, Response } from 'express';
import pool from '../db';
import { GuestbookParams, ApiResponse } from '../utils/types';

const router = express.Router();

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

// 좋아요 취소
router.put('/:id/unlike', async (req: Request<GuestbookParams>, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'UPDATE guestbook SET likes = CASE WHEN likes > 0 THEN likes - 1 ELSE 0 END WHERE id = $1 RETURNING *',
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

export default router; 