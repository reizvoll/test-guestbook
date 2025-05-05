'use client';

import { useDeleteGuestbookEntry, useGuestbookEntries, useToggleLike, useUpdateGuestbookEntry } from '@/lib/hooks/useGuestbook';
import { userStore } from '@/lib/store/userStore';
import { Guestbook } from '@/lib/types/guestbook';
import { useState } from 'react';
import { Alert } from './Alert';
import LoadingSpinner from './LoadingSpinner';

const GuestbookList = () => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const { user } = userStore();

  const { data: guestbooks = [], isPending, error } = useGuestbookEntries();
  const { mutate: updateEntry, isPending: isUpdating } = useUpdateGuestbookEntry();
  const { mutate: deleteEntry, isPending: isDeleting } = useDeleteGuestbookEntry();
  const { mutate: toggleLike, isPending: isLiking } = useToggleLike();

  const handleEdit = (guestbook: Guestbook) => {
    if (user?.id !== guestbook.user_id) return;
    setEditingId(guestbook.id);
    setEditContent(guestbook.contents);
  };

  const handleSaveEdit = (id: number) => {
    updateEntry(
      { id, contents: editContent },
      {
        onSuccess: () => {
          setEditingId(null);
          Alert('방명록이 수정되었습니다.');
        },
        onError: () => {
          Alert('방명록 수정에 실패했습니다.');
        }
      }
    );
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('정말로 이 방명록을 삭제하시겠습니까?')) return;
    
    deleteEntry(id, {
      onSuccess: () => {
        Alert('방명록이 삭제되었습니다.');
      },
      onError: () => {
        Alert('방명록 삭제에 실패했습니다.');
      }
    });
  };

  const handleLike = (id: number, isLiked: boolean) => {
    if (!user) {
      Alert('로그인이 필요한 기능입니다.');
      return;
    }
    
    toggleLike(
      { id, isLiked },
      {
        onError: () => {
          Alert('좋아요 처리에 실패했습니다.');
        }
      }
    );
  };

  if (isPending) {
    return <div ><LoadingSpinner /></div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        방명록을 불러오는데 실패했습니다.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="space-y-4">
        {guestbooks.length > 0 ? (
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
                        disabled={isUpdating}
                      />
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(guestbook.id)}
                          className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                          disabled={isUpdating}
                        >
                          {isUpdating ? '저장 중...' : '저장'}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                          disabled={isUpdating}
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
                    onClick={() => handleLike(guestbook.id, guestbook.liked_by_user)}
                    className={`${guestbook.liked_by_user ? 'text-red-600' : 'text-gray-400'} hover:text-red-800 disabled:opacity-50`}
                    disabled={isLiking}
                  >
                    좋아요 ({guestbook.likes})
                  </button>
                  {user?.id === guestbook.user_id && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(guestbook)}
                        className="text-indigo-600 hover:text-indigo-800"
                        disabled={isDeleting}
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(guestbook.id)}
                        className="text-red-600 hover:text-red-800"
                        disabled={isDeleting}
                      >
                        {isDeleting ? '삭제 중...' : '삭제'}
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