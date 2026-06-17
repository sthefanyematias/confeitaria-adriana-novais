
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CarrinhoService } from '../../core/services/carrinho.service';
import { ModalService } from '../../core/services/modal.service';
import { ItemCarrinho } from '../../core/models/carrinho.model';

@Component({
    selector: 'app-carrinho',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './carrinho.html',
    styleUrl: './carrinho.css'
})
export class Carrinho implements OnInit, OnDestroy {
    itens: ItemCarrinho[] = [];
    total = 0;
    private subs: Subscription[] = [];

    constructor(
        private carrinhoService: CarrinhoService,
        private modal: ModalService
    ) { }

    ngOnInit(): void {
        this.subs.push(
            this.carrinhoService.itensObs$.subscribe((itens) => {
                this.itens = itens;
            })
        );
        this.subs.push(
            this.carrinhoService.totalValor$.subscribe((v) => (this.total = v))
        );
    }

    ngOnDestroy(): void {
        this.subs.forEach((s) => s.unsubscribe());
    }

    incrementar(item: ItemCarrinho): void {
        this.carrinhoService.alterarQuantidade(item.produto_id, item.quantidade + 1);
    }

    decrementar(item: ItemCarrinho): void {
        this.carrinhoService.alterarQuantidade(item.produto_id, item.quantidade - 1);
    }

    aoAlterarQuantidade(item: ItemCarrinho, evento: Event): void {
        const valor = parseInt((evento.target as HTMLInputElement).value, 10);
        if (!isNaN(valor) && valor >= 1) {
            this.carrinhoService.alterarQuantidade(item.produto_id, valor);
        }
    }

    remover(item: ItemCarrinho): void {
        this.modal.confirmar(
            'Remover item',
            `Deseja remover "${item.nome}" do carrinho?`,
            () => this.carrinhoService.remover(item.produto_id)
        );
    }

    limparCarrinho(): void {
        this.modal.confirmar(
            'Limpar carrinho',
            'Deseja remover todos os itens do carrinho?',
            () => this.carrinhoService.limpar()
        );
    }

    formatarPreco(valor: number): string {
        return 'R$ ' + valor.toFixed(2).replace('.', ',');
    }

    get totalItens(): number {
        return this.itens.reduce((acc, i) => acc + i.quantidade, 0);
    }
}
