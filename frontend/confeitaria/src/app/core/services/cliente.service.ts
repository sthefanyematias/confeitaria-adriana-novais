
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from './api-config.service';
import { Cliente } from '../models/cliente.model';

@Injectable({ providedIn: 'root' })
export class ClienteService {
    constructor(
        private http: HttpClient,
        private apiConfig: ApiConfigService
    ) { }

    private get url(): string {
        return `${this.apiConfig.getBaseUrl()}/cliente`;
    }

    listar(): Observable<Cliente[]> {
        return this.http.get<Cliente[]>(this.url);
    }

    buscarPorId(id: number): Observable<Cliente> {
        return this.http.get<Cliente>(`${this.url}/${id}`);
    }

    cadastrar(cliente: Partial<Cliente>): Observable<{ mensagem: string; novoId: number }> {
        return this.http.post<{ mensagem: string; novoId: number }>(this.url, cliente);
    }

    editar(id: number, cliente: Partial<Cliente>): Observable<{ mensagem: string }> {
        return this.http.put<{ mensagem: string }>(`${this.url}/${id}`, cliente);
    }

    excluir(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}
