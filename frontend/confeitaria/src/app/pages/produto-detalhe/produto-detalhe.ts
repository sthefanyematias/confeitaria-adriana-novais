
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProdutoService } from '../../core/services/produto.service';
import { CarrinhoService } from '../../core/services/carrinho.service';
import { ApiConfigService } from '../../core/services/api-config.service';
import { ModalService } from '../../core/services/modal.service';
import { Produto } from '../../core/models/produto.model';

@Component({
    selector: 'app-produto-detalhe',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './produto-detalhe.html',
    styleUrl: './produto-detalhe.css'
})
export class ProdutoDetalhe implements OnInit, OnDestroy {
    produto: Produto | null = null;
    imagemUrl = '';
    quantidade = 1;
    adicionado = false;
    carregando = true;
    private subs: Subscription[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private produtoService: ProdutoService,
        private carrinhoService: CarrinhoService,
        private apiConfig: ApiConfigService,
        private modal: ModalService
    ) { }

    ngOnInit(): void {
        this.subs.push(
            this.route.paramMap.subscribe((params) => {
                const id = Number(params.get('id'));
                if (!id) {
                    this.router.navigate(['/produtos']);
                    return;
                }
                this.carregarProduto(id);
            })
        );
    }

    ngOnDestroy(): void {
        this.subs.forEach((s) => s.unsubscribe());
    }

    private carregarProduto(id: number): void {
        this.carregando = true;
        this.subs.push(
            this.produtoService.buscarPorId(id).subscribe({
                next: (p) => {
                    this.produto = p;
                    this.imagemUrl = this.resolverImagem(p.imagem_url);
                    this.carregando = false;
                },
                error: () => {
                    this.carregando = false;
                    this.modal.erro('Produto não encontrado', 'Não foi possível carregar os detalhes deste produto.');
                    this.router.navigate(['/produtos']);
                }
            })
        );
    }

    private resolverImagem(url?: string): string {
        if (!url) return '/images/produto-placeholder.png';
        if (url.startsWith('http')) return url;
        if (url.startsWith('/')) return `${this.apiConfig.getBaseUrl()}${url}`;
        return `${this.apiConfig.getBaseUrl()}/images/${url}`;
    }

    incrementar(): void {
        if (this.produto && this.quantidade < this.produto.estoque) {
            this.quantidade++;
        }
    }

    decrementar(): void {
        if (this.quantidade > 1) this.quantidade--;
    }

    aoAlterarQuantidade(evento: Event): void {
        const valor = parseInt((evento.target as HTMLInputElement).value, 10);
        if (this.produto && !isNaN(valor) && valor >= 1 && valor <= this.produto.estoque) {
            this.quantidade = valor;
        }
    }

    adicionarAoCarrinho(): void {
        if (!this.produto || this.semEstoque) return;
        this.carrinhoService.adicionar({
            produto_id: this.produto.id!,
            nome: this.produto.nome,
            preco: this.produto.preco,
            quantidade: this.quantidade,
            imagem_url: this.imagemUrl,
            subtotal: this.produto.preco * this.quantidade
        });
        this.adicionado = true;
        this.quantidade = 1;
        this.modal.sucesso('Adicionado ao carrinho', `${this.quantidade}x ${this.produto.nome} foi adicionado com sucesso.`);
        setTimeout(() => (this.adicionado = false), 2500);
    }

    get semEstoque(): boolean {
        return !this.produto || this.produto.estoque === 0;
    }

    formatarPreco(valor: number): string {
        return 'R$ ' + valor.toFixed(2).replace('.', ',');
    }

    voltar(): void {
        history.back();
    }
}
