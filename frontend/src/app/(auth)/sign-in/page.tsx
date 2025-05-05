'use client';

import { AuthForm } from '@/lib/components/auth/AuthForm';
import { AuthInput } from '@/lib/components/auth/AuthInput';
import { useAuth } from '@/lib/hooks/useAuth';
import { type SignInFormData } from '@/lib/types/auth';
import { ChangeEvent, FormEvent, useState } from 'react';

export default function SignIn() {
  const { error, handleSignIn } = useAuth();
  const [formData, setFormData] = useState<SignInFormData>({
    email: '',
    password: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await handleSignIn(formData);
    } catch (err) {
      // 에러는 useAuth에서 처리
    }
  };

  return (
    <AuthForm
      title="로그인"
      error={error}
      linkText="계정이 없으신가요? 회원가입"
      linkHref="/sign-up"
      onSubmit={handleSubmit}
    >
      <div className="rounded-md shadow-sm -space-y-px">
        <AuthInput
          id="email"
          name="email"
          type="email"
          placeholder="이메일"
          value={formData.email}
          onChange={handleChange}
          className="rounded-t-md"
        />
        <AuthInput
          id="password"
          name="password"
          type="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={handleChange}
          className="rounded-b-md"
        />
      </div>

      <div>
        <button
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          로그인
        </button>
      </div>
    </AuthForm>
  );
}
