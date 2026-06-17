import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiConfigService } from './api-config.service';
import { LoginRequest, LoginResponse, Admin } from '../models/admin.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly TOKEN_KEY = 'token';
    private readonly ADMIN_KEY = 'admin_dados';

    constructor(
        private http: HttpClient,
        private apiConfig: ApiConfigService
    ) { }

    login(credenciais: LoginRequest): Observable<LoginResponse> {
        const url = `${this.apiConfig.getBaseUrl()}/admin/login`;

        const corpoFormatado = {
            email: credenciais.email,
            senha: credenciais.senha
        };

        return this.http.post<LoginResponse>(url, corpoFormatado).pipe(
            tap((res) => {
                localStorage.setItem(this.TOKEN_KEY, res.token);
                localStorage.setItem(this.ADMIN_KEY, JSON.stringify(res.admin));
            })
        );
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.ADMIN_KEY);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    getAdmin(): Admin | null {
        const dados = localStorage.getItem(this.ADMIN_KEY);
        return dados ? JSON.parse(dados) : null;
    }

    estaAutenticado(): boolean {
        const token = this.getToken();
        if (!token) return false;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const agora = Math.floor(Date.now() / 1000);
            return payload.exp ? payload.exp > agora : true;
        } catch {
            return !!token;
        }
    }
}