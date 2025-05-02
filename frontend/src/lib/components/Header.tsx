'use client';

import { useStore } from '@/lib/store/useStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Header = () => {
  const { isLoggedIn, user, setUser } = useStore();
  const router = useRouter();

  // 로컬 스토리지에서 사용자 정보 확인
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    console.log('Stored User:', storedUser);
    console.log('Token:', token);
    
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('Parsed User:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, [setUser]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  };

  return (
    <header className="w-full">
      <div className="flex justify-end items-center p-4">
        {!isLoggedIn ? (
          <div className="flex items-center gap-4">
            <span className="text-body text-gray-600">로그인이 필요합니다.</span>
            <button 
              onClick={() => router.push('/sign-in')}
              className="inline-flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 font-medium text-body"
            >
              로그인
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-body text-gray-600">
              안녕하세요, {user?.nickname}님
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 font-medium text-body"
            >
              로그아웃
            </button>
          </div>
        )}
      </div>
    </header>
  );
} 

export default Header;