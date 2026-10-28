export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthUser {
    id: number;
    email: string;
    full_name: string;
    role: 'author' | 'admin';
    author_id: number | null;
    phone: string | null;
    city: string | null;
}

export interface LoginData {
    access_token: string;
    token_type: string;
    user: AuthUser;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: LoginData;
}