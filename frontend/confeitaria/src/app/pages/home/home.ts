
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProdutoService } from '../../core/services/produto.service';
import { Produto } from '../../core/models/produto.model';
import { CardProduto } from '../../components/card-produto/card-produto';

interface CategoriaFixa {
    id: number;
    nome: string;
    imgRosa: string;
    imgBranca: string;
}

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterLink, CardProduto],
    templateUrl: './home.html',
    styleUrl: './home.css'
})
export class Home implements OnInit, OnDestroy, AfterViewInit {
    destaques: Produto[] = [];
    carregando = true;
    categoriaSelecionadaId: number | null = null;
    private subs: Subscription[] = [];

    @ViewChildren('videoEl') videoEls!: QueryList<ElementRef<HTMLVideoElement>>;

    readonly whatsapp = 'https://wa.me/5511958908798';

    readonly videos = [
        { src: '/videos/video1.mp4' },
        { src: '/videos/video2.mp4' },
        { src: '/videos/video3.mp4' },
        { src: '/videos/video4.mp4' }
    ];

    readonly categoriasFixas: CategoriaFixa[] = [
        { id: 1, nome: 'Bolos', imgRosa: '/images/bolo-rosa.png', imgBranca: '/images/bolo-branco.png' },
        { id: 2, nome: 'Tortas', imgRosa: '/images/torta-rosa.png', imgBranca: '/images/torta-branco.png' },
        { id: 3, nome: 'Brigadeiro', imgRosa: '/images/brigadeiro-rosa.png', imgBranca: '/images/brigadeiro-branco.png' },
        { id: 4, nome: 'Pudim', imgRosa: '/images/pudim-rosa.png', imgBranca: '/images/pudim-branco.png' }
    ];

    constructor(
        private produtoService: ProdutoService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.carregarDestaques();
        this.iniciarPolling();
    }

    ngAfterViewInit(): void {
    }

    ngOnDestroy(): void {
        this.subs.forEach((s) => s.unsubscribe());
    }

    private carregarDestaques(): void {
        this.subs.push(
            this.produtoService.listarDestaque().subscribe({
                next: (p) => {
                    this.destaques = p;
                    this.carregando = false;
                },
                error: () => (this.carregando = false)
            })
        );
    }

    private iniciarPolling(): void {
        this.subs.push(
            this.produtoService.polling(5000).subscribe((produtos) => {
                if (this.categoriaSelecionadaId === null) {
                    this.destaques = produtos.filter((p) => p.destaque);
                }
            })
        );
    }

    selecionarCategoria(id: number): void {
        this.categoriaSelecionadaId = id;
        this.router.navigate(['/produtos'], { queryParams: { categoria_id: id } });
    }

    scrollParaVideos(): void {
        const elemento = document.getElementById('videos');
        if (elemento) {
            elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}
