import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ItemCarrinho } from '../models/carrinho.model';
import { ApiConfigService } from './api-config.service';

@Injectable({ providedIn: 'root' })
export class CarrinhoService {
    private readonly CHAVE = 'carrinho';
    private itens$ = new BehaviorSubject<ItemCarrinho[]>(this.carregarStorage());

    constructor(private apiConfig: ApiConfigService) { }

    get itensObs$(): Observable<ItemCarrinho[]> {
        return this.itens$.asObservable();
    }

    get totalItens$(): Observable<number> {
        return this.itens$.pipe(
            map((itens) => itens.reduce((acc, i) => acc + i.quantidade, 0))
        );
    }

    get totalValor$(): Observable<number> {
        return this.itens$.pipe(
            map((itens) => itens.reduce((acc, i) => acc + i.subtotal, 0))
        );
    }

    get itens(): ItemCarrinho[] {
        return this.itens$.value;
    }

    get totalItens(): number {
        return this.itens$.value.reduce((acc, i) => acc + i.quantidade, 0);
    }

    get totalValor(): number {
        return this.itens$.value.reduce((acc, i) => acc + i.subtotal, 0);
    }

    adicionar(item: ItemCarrinho): void {
        const lista = [...this.itens$.value];
        const indice = lista.findIndex((i) => i.produto_id === item.produto_id);

        if (item.imagem_url) {
            item.imagem_url = this.apiConfig.getUrlImagemProduto(item.imagem_url);
        }

        if (indice >= 0) {
            lista[indice] = {
                ...lista[indice],
                quantidade: lista[indice].quantidade + item.quantidade,
                subtotal: lista[indice].preco * (lista[indice].quantidade + item.quantidade)
            };
        } else {
            lista.push(item);
        }
        this.persistir(lista);
    }

    remover(produto_id: number): void {
        const lista = this.itens$.value.filter((i) => i.produto_id !== produto_id);
        this.persistir(lista);
    }

    alterarQuantidade(produto_id: number, quantidade: number): void {
        if (quantidade <= 0) {
            this.remover(produto_id);
            return;
        }
        const lista = this.itens$.value.map((i) =>
            i.produto_id === produto_id
                ? { ...i, quantidade, subtotal: i.preco * quantidade }
                : i
        );
        this.persistir(lista);
    }

    limpar(): void {
        this.persistir([]);
    }

    private persistir(itens: ItemCarrinho[]): void {
        localStorage.setItem(this.CHAVE, JSON.stringify(itens));
        this.itens$.next(itens);
    }

    private carregarStorage(): ItemCarrinho[] {
        const dados = localStorage.getItem(this.CHAVE);
        return dados ? JSON.parse(dados) : [];
    }
}