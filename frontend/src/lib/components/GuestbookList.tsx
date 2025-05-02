'use client';

import { useState, useEffect } from 'react';
import { guestbookApi, likesApi } from '@/api/api';
import { Guestbook } from '@/lib/types/guestbook';
import { userStore } from '@/lib/store/userStore';

const GuestbookList = () => {
  const [guestbooks, setGuestbooks] = useState<Guestbook[]>([]);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const { user } = userStore();

  useEffect(() => {
    fetchGuestbooks();
  }, []);

  const fetchGuestbooks = async () => {
    try {
      const response = await guestbookApi.getGuestbooks();
      const data = Array.isArray(response.data) ? response.data : [];
      setGuestbooks(data);
    } catch (err) {
      setError('방명록을 불러오는데 실패했습니다.');
      setGuestbooks([]);
    }
  };

  const handleEdit = (guestbook: Guestbook) => {
    if (user?.id !== guestbook.user_id) return;
    setEditingId(guestbook.id);
    setEditContent(guestbook.contents);
  };

  const handleSaveEdit = async (id: number) => {
    try {
      await guestbookApi.updateGuestbook(id, { contents: editContent });
      setEditingId(null);
      fetchGuestbooks();
    } catch (err) {
      setError('방명록 수정에 실패했습니다.');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleDelete = async (id: number) => {
    try {
      await guestbookApi.deleteGuestbook(id);
      fetchGuestbooks();
    } catch (err) {
      setError('방명록 삭제에 실패했습니다.');
    }
  };

  const handleLike = async (id: number) => {
    try {
      await likesApi.updateLike(id);
      fetchGuestbooks();
    } catch (err) {
      setError('좋아요 처리에 실패했습니다.');
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {guestbooks && guestbooks.length > 0 ? (
          guestbooks.map((guestbook) => (
            <div
              key={guestbook.id}
              className="bg-white p-4 rounded-lg shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-gray-600">{guestbook.user_nickname}</p>
                  {editingId === guestbook.id ? (
                    <div className="mt-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-2 border rounded"
                        rows={3}
                      />
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(guestbook.id)}
                          className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                          저장
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="mt-2">{guestbook.contents}</p>
                      <p className="text-sm text-gray-400 mt-2">
                        {new Date(guestbook.created_at).toLocaleString()}
                      </p>
                    </>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => handleLike(guestbook.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    좋아요 ({guestbook.likes || 0})
                  </button>
                  {user?.id === guestbook.user_id && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(guestbook)}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(guestbook.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">
            작성된 방명록이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}

export default GuestbookList;