import { authApi } from '@/api/api';
import { Alert } from '@/lib/components/ui/Alert';
import { userStore } from '@/lib/store/userStore';
import { signInSchema, signUpSchema, type SignInFormData, type SignUpFormData } from '@/lib/types/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ZodError } from 'zod';

export function useAuth() {
  const router = useRouter();
  const { setUser } = userStore();
  const [error, setError] = useState('');

  const handleSignIn = async (formData: SignInFormData) => {
    try {
      const validatedData = signInSchema.parse(formData);
      const response = await authApi.login(validatedData.email, validatedData.password);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        
        if (response.data.user) {
          const userData = {
            id: response.data.user.id,
            nickname: response.data.user.nickname
          };
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
        }
        
        router.push('/');
      }
    } catch (err) {
      if (err instanceof ZodError) {
        setError(err.errors[0]?.message || '입력값을 확인해주세요.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
      throw err;
    }
  };

  const handleSignUp = async (formData: SignUpFormData) => {
    try {
      const validatedData = signUpSchema.parse(formData);
      await authApi.register(validatedData.email, validatedData.password, validatedData.nickname);
      Alert('회원가입에 성공했습니다!');
      router.push('/sign-in');
    } catch (err) {
      if (err instanceof ZodError) {
        setError(err.errors[0]?.message || '입력값을 확인해주세요.');
      } else if (err instanceof Error) {
        let rawMessage =
          (err as any).response?.data?.error ||
          (err as any).response?.data?.message ||
          err.message;

        // 객체라면 문자열로 변환
        if (typeof rawMessage !== 'string') {
          rawMessage = JSON.stringify(rawMessage);
        }

        let message = rawMessage;
        if (rawMessage.includes('Email already exists')) {
          message = '이미 사용 중인 이메일입니다.';
        }
        if (rawMessage.includes('Nickname already exists')) {
          message = '이미 사용 중인 닉네임입니다.';
        }

        setError(message);
        Alert(message);
      } else {
        setError('회원가입에 실패했습니다. 다시 시도해주세요.');
        Alert('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
      throw err;
    }
  };

  return {
    error,
    setError,
    handleSignIn,
    handleSignUp,
  };
} 