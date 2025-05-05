// Guestbook 관련 타입
export type GuestbookParams = {
    id: string;
};

export type GuestbookBody = {
    contents: string;
};

export type GuestbookCreateBody = {
    user_id?: number;
    user_nickname?: string;
    contents: string;
};

// Auth 관련 타입
export type RegisterBody = {
    id: string;
    email: string;
    password: string;
    nickname: string;
};

export type LoginBody = {
    email: string;
    password: string;
};

export type ChangePasswordBody = {
    email: string;
    currentPassword: string;
    newPassword: string;
};

// 응답 타입
export type ApiResponse<T = any> = {
    message?: string;
    error?: string;
    user?: {
        id: number;
        nickname: string;
    };
    token?: string;
} 