
export interface Admin {
    id?: number;
    nome: string;
    email: string;
    senha?: string;
    ativo?: boolean;
    cadastro?: string;
}

export interface LoginRequest {
    email: string;
    senha: string;
}

export interface LoginResponse {
    token: string;
    admin: Admin;
}
