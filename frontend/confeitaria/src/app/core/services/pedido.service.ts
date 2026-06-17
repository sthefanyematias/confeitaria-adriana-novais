
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
import { Pedido, StatusPedido } from '../models/pedido.model';

@Injectable({ providedIn: 'root' })
export class PedidoService implements OnDestroy {
    private destruir$ = new Subject<void>();

    constructor(
        private http: HttpClient,
        private apiConfig: ApiConfigService
    ) { }

    private get url(): string {
        return `${this.apiConfig.getBaseUrl()}/pedido`;
    }

    listar(): Observable<Pedido[]> {
        return this.http.get<Pedido[]>(this.url);
    }

    buscarPorId(id: number): Observable<Pedido> {
        return this.http.get<Pedido>(`${this.url}/${id}`);
    }

    criar(pedido: Partial<Pedido>): Observable<{ mensagem: string; novoId: number }> {
        return this.http.post<{ mensagem: string; novoId: number }>(this.url, pedido);
    }

    editar(id: number, pedido: Partial<Pedido>): Observable<{ mensagem: string }> {
        return this.http.put<{ mensagem: string }>(`${this.url}/${id}`, pedido);
    }

    atualizarStatus(id: number, status: StatusPedido): Observable<{ mensagem: string }> {
        return this.http.patch<{ mensagem: string }>(`${this.url}/${id}/status`, { status });
    }

    cancelar(id: number): Observable<{ mensagem: string }> {
        return this.atualizarStatus(id, 'cancelado');
    }

    excluir(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }

    polling(intervaloMs = 5000): Observable<Pedido[]> {
        return interval(intervaloMs).pipe(
            startWith(0),
            switchMap(() => this.listar()),
            takeUntil(this.destruir$),
            shareReplay(1)
        );
    }

    ngOnDestroy(): void {
        this.destruir$.next();
        this.destruir$.complete();
    }
}
