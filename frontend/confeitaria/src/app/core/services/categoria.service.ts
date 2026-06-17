
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from './api-config.service';
import { Categoria } from '../models/categoria.model';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
    constructor(
        private http: HttpClient,
        private apiConfig: ApiConfigService
    ) { }

    private get url(): string {
        return `${this.apiConfig.getBaseUrl()}/categorias`;
    }

    listar(): Observable<Categoria[]> {
        return this.http.get<Categoria[]>(this.url);
    }

    listarAtivas(): Observable<Categoria[]> {
        return this.http.get<Categoria[]>(`${this.url}?ativo=true`);
    }

    buscarPorId(id: number): Observable<Categoria> {
        return this.http.get<Categoria>(`${this.url}/${id}`);
    }

    cadastrar(categoria: Partial<Categoria>): Observable<Categoria> {
        return this.http.post<Categoria>(this.url, categoria);
    }

    editar(id: number, categoria: Partial<Categoria>): Observable<Categoria> {
        return this.http.put<Categoria>(`${this.url}/${id}`, categoria);
    }

    excluir(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}
