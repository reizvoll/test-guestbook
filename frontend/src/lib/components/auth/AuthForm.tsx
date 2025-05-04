import { FormEvent, ReactNode } from 'react';
import Link from 'next/link';

type AuthFormProps = {
  title: string;
  children: ReactNode;
  error?: string;
  linkText: string;
  linkHref: string;
  onSubmit: (e: FormEvent) => void;
}

export function AuthForm({
  title,
  children,
  error,
  linkText,
  linkHref,
  onSubmit,
}: AuthFormProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {title}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          {children}
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
        </form>
        <div className="text-center">
          <Link
            href={linkHref}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            {linkText}
          </Link>
        </div>
      </div>
    </div>
  );
} 