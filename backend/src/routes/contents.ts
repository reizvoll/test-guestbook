import express, { Request, Response } from 'express';
import pool from '../db';
import { GuestbookParams, GuestbookBody, ApiResponse } from '../utils/types';

const router = express.Router();

// 방명록 수정
router.put('/:id', async (req: Request<GuestbookParams, {}, GuestbookBody>, res: Response): Promise<void> => {
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