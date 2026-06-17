
import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    Observable,
    interval,
    Subject,
    switchMap,
    takeUntil,
    shareReplay,
    startWith
} from 'rxjs';
import { ApiConfigService } from './api-config.service';
import { Produto } from '../models/produto.model';

@Injectable({ providedIn: 'root' })
export class ProdutoService implements OnDestroy {
    private destruir$ = new Subject<void>();

    constructor(
        private http: HttpClient,
        private apiConfig: ApiConfigService
    ) { }

    private get url(): string {
        return `${this.apiConfig.getBaseUrl()}/produtos`;
    }

    listar(): Observable<Produto[]> {
        return this.http.get<Produto[]>(this.url);
    }

    listarAtivos(): Observable<Produto[]> {
        return this.http.get<Produto[]>(`${this.url}?ativo=true`);
    }

    listarDestaque(): Observable<Produto[]> {
        return this.http.get<Produto[]>(`${this.url}?destaque=true&ativo=true`);
    }

    listarPorCategoria(categoriaId: number): Observable<Produto[]> {
        return this.http.get<Produto[]>(
            `${this.url}?categoria_id=${categoriaId}&ativo=true`
        );
    }

    buscarPorId(id: number): Observable<Produto> {
        return this.http.get<Produto>(`${this.url}/${id}`);
    }

    cadastrar(dados: FormData): Observable<Produto> {
        return this.http.post<Produto>(this.url, dados);
    }

    editar(id: number, dados: FormData): Observable<Produto> {
        return this.http.put<Produto>(`${this.url}/${id}`, dados);
    }

    excluir(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }

    polling(intervaloMs = 5000): Observable<Produto[]> {
        return interval(intervaloMs).pipe(
            startWith(0),
            switchMap(() => this.listarAtivos()),
            takeUntil(this.destruir$),
            shareReplay(1)
        );
    }

    ngOnDestroy(): void {
        this.destruir$.next();
        this.destruir$.complete();
    }
}
