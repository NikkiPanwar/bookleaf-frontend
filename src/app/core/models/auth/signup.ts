export interface SignupRequest {
    email: string;
    password: string;
    full_name:string;
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

export interface SignupData {
    access_token: string;
    token_type: string;
    user: AuthUser;
}

export interface SignupResponse {
    success: boolean;
    message: string;
    data: SignupData;
}