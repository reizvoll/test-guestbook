'use client';

import { FormEvent, useState } from 'react';
import { guestbookApi } from '@/api/api';
import { userStore } from '@/lib/store/userStore';


const GuestbookInput = () => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const { user } = userStore();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      // 비로그인 유저 id, 임의 생성 로직 추가
      const randomUserId = Math.floor(100000 + Math.random() * 900000);
      const randomNickname = `Guest${String(randomUserId).slice(-4)}`;

      await guestbookApi.createGuestbook({ 
        contents: content,
        user_id: user?.id || randomUserId,
        user_nickname: user?.nickname || randomNickname
      });
      setContent('');
    } catch (err) {
      setError('방명록 작성에 실패했습니다.');
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="방명록을 작성해주세요"
            className="w-full flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            작성
          </button>
        </div>
      </form>
    </div>
  );
}
export default GuestbookInput;