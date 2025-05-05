import express, { Request, Response } from 'express';
import pool from '../db';
import { ApiResponse, GuestbookParams } from '../utils/types';

const router = express.Router();

// 좋아요 업데이트
router.put('/:id', async (req: Request<GuestbookParams, {}, { user_id: number; action: 'like' | 'unlike' }>, res: Response): Promise<void> => {
    const { id } = req.params;
    const { user_id, action } = req.body;

    if (!user_id) {
        console.log('User ID is missing');
        res.status(400).json({ error: 'User ID is required' } as ApiResponse);
        return;
    }

    if (!action || !['like', 'unlike'].includes(action)) {
        console.log('Invalid action:', action);
        res.status(400).json({ error: 'Invalid action' } as ApiResponse);
        return;
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 먼저 게스트북 엔트리가 존재하는지 확인
        const guestbookCheck = await client.query(
            'SELECT id FROM guestbook WHERE id = $1',
            [id]
        );

        if (guestbookCheck.rows.length === 0) {
            await client.query('ROLLBACK');
            console.log('Guestbook entry not found:', id);
            res.status(404).json({ error: 'Guestbook entry not found' } as ApiResponse);
            return;
        }

        if (action === 'like') {
            // 이미 좋아요를 눌렀는지 확인
            const existingLike = await client.query(
                'SELECT id FROM likes WHERE guestbook_id = $1 AND user_id = $2',
                [id, user_id]
            );

            if (existingLike.rows.length > 0) {
                await client.query('ROLLBACK');
                console.log('User already liked this entry:', { id, user_id });
                res.status(400).json({ error: 'You have already liked this entry' } as ApiResponse);
                return;
            }

            // 좋아요 추가
            await client.query(
                'INSERT INTO likes (guestbook_id, user_id) VALUES ($1, $2)',
                [id, user_id]
            );

            const result = await client.query(
                'UPDATE guestbook SET likes = likes + 1 WHERE id = $1 RETURNING *',
                [id]
            );
            
            await client.query('COMMIT');
            console.log('Like added successfully:', result.rows[0]);
            res.json(result.rows[0]);
        } else {
            // 좋아요 삭제
            const deleteResult = await client.query(
                'DELETE FROM likes WHERE guestbook_id = $1 AND user_id = $2',
                [id, user_id]
            );

            if (deleteResult.rowCount === 0) {
                await client.query('ROLLBACK');
                console.log('User has not liked this entry:', { id, user_id });
                res.status(400).json({ error: 'You have not liked this entry' } as ApiResponse);
                return;
            }

            const result = await client.query(
                'UPDATE guestbook SET likes = CASE WHEN likes > 0 THEN likes - 1 ELSE 0 END WHERE id = $1 RETURNING *',
                [id]
            );
            
            await client.query('COMMIT');
            console.log('Like removed successfully:', result.rows[0]);
            res.json(result.rows[0]);
        }
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error updating likes:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        } as ApiResponse);
    } finally {
        client.release();
    }
});

export default router; 