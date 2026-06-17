
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProdutoService } from '../../core/services/produto.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { Produto } from '../../core/models/produto.model';
import { Categoria } from '../../core/models/categoria.model';
import { CardProduto } from '../../components/card-produto/card-produto';

@Component({
    selector: 'app-produtos',
    standalone: true,
    imports: [CardProduto],
    templateUrl: './produtos.html',
    styleUrl: './produtos.css'
})
export class Produtos implements OnInit, OnDestroy {
    todos: Produto[] = [];
    exibidos: Produto[] = [];
    categorias: Categoria[] = [];
    categoriaAtiva: number | null = null;
    carregando = true;
    private subs: Subscription[] = [];

    constructor(
        private produtoService: ProdutoService,
        private categoriaService: CategoriaService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.carregarCategorias();
        this.subs.push(
            this.route.queryParamMap.subscribe((params) => {
                const id = params.get('categoria_id');
                this.categoriaAtiva = id ? Number(id) : null;
                this.filtrar();
            })
        );
        this.iniciarPolling();
    }

    ngOnDestroy(): void {
        this.subs.forEach((s) => s.unsubscribe());
    }

    private carregarCategorias(): void {
        this.subs.push(
            this.categoriaService.listarAtivas().subscribe({
                next: (cats) => (this.categorias = cats),
                error: () => { }
            })
        );
    }

    private iniciarPolling(): void {
        this.subs.push(
            this.produtoService.polling(5000).subscribe((produtos) => {
                this.todos = produtos;
                this.filtrar();
                this.carregando = false;
            })
        );
    }

    private filtrar(): void {
        if (this.categoriaAtiva) {
            this.exibidos = this.todos.filter((p) => {
                const catId = p.categoria_id ?? (p as any).categoriaId ?? p.categoria?.id;
                return Number(catId) === this.categoriaAtiva;
            });
        } else {
            this.exibidos = [...this.todos];
        }
    }

    selecionarCategoria(id: number | null): void {
        this.categoriaAtiva = id;
        if (id) {
            this.router.navigate([], { queryParams: { categoria_id: id }, queryParamsHandling: 'merge' });
        } else {
            this.router.navigate([], { queryParams: {} });
        }
        this.filtrar();
    }

    nomeCategoriaAtiva(): string {
        if (!this.categoriaAtiva) return '';
        return this.categorias.find((c) => c.id === this.categoriaAtiva)?.nome || '';
    }
}
