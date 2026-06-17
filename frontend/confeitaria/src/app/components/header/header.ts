
import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CarrinhoService } from '../../core/services/carrinho.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './header.html',
    styleUrl: './header.css'
})
export class Header implements OnInit, OnDestroy {
    scrolled = false;
    menuAberto = false;
    totalItens = 0;
    private subs: Subscription[] = [];

    constructor(
        private carrinhoService: CarrinhoService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.subs.push(
            this.carrinhoService.totalItens$.subscribe(
                (total) => (this.totalItens = total)
            )
        );

        this.subs.push(
            this.router.events.pipe(
                filter((e): e is NavigationEnd => e instanceof NavigationEnd)
            ).subscribe(() => {
                this.fecharMenu();
            })
        );
    }

    ngOnDestroy(): void {
        this.subs.forEach((s) => s.unsubscribe());
        document.body.style.overflow = '';
    }

    @HostListener('window:scroll')
    aoRolar(): void {
        this.scrolled = window.scrollY > 60;
    }

    @HostListener('window:keydown', ['$event'])
    aoTeclar(e: KeyboardEvent): void {
        if (e.key === 'Escape' && this.menuAberto) {
            this.fecharMenu();
        }
    }

    toggleMenu(): void {
        this.menuAberto = !this.menuAberto;
        document.body.style.overflow = this.menuAberto ? 'hidden' : '';
    }

    fecharMenu(): void {
        this.menuAberto = false;
        document.body.style.overflow = '';
    }
}
