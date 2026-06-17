import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { interval, Subscription, switchMap } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { PedidoService } from '../../core/services/pedido.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout implements OnInit, OnDestroy {
  sidebarAberta = true;
  nomeAdmin = '';
  notificacoes = 0;

  private ultimoTotal = 0;
  private pollSub?: Subscription;

  constructor(
    private auth: AuthService,
    private router: Router,
    private pedidoService: PedidoService
  ) { }

  ngOnInit(): void {
    const admin = this.auth.getAdmin();
    this.nomeAdmin = admin?.nome?.split(' ')[0] || 'Admin';

    if (window.innerWidth < 900) {
      this.sidebarAberta = false;
    }

    this.ultimoTotal = Number(localStorage.getItem('pedidos_ultimo_total') || '0');
    this.iniciarPollingPedidos();
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  private iniciarPollingPedidos(): void {
    this.pedidoService.listar().subscribe({
      next: (pedidos) => {
        const total = pedidos.length;
        if (total > this.ultimoTotal) {
          this.notificacoes += total - this.ultimoTotal;
        }
        this.ultimoTotal = total;
        localStorage.setItem('pedidos_ultimo_total', String(total));
      },
      error: () => { }
    });

    this.pollSub = interval(10000).pipe(
      switchMap(() => this.pedidoService.listar())
    ).subscribe({
      next: (pedidos) => {
        const total = pedidos.length;
        const ultimo = Number(localStorage.getItem('pedidos_ultimo_total') || '0');
        if (total > ultimo) {
          this.notificacoes += total - ultimo;
          localStorage.setItem('pedidos_ultimo_total', String(total));
        }
        this.ultimoTotal = total;
      },
      error: () => { }
    });
  }

  limparNotificacoes(): void {
    this.notificacoes = 0;
    localStorage.setItem('pedidos_ultimo_total', String(this.ultimoTotal));
    this.router.navigate(['/admin/pedidos']);
  }

  @HostListener('window:keydown', ['$event'])
  aoTeclar(e: KeyboardEvent): void {
    if (e.key === 'Escape' && window.innerWidth < 900) {
      this.sidebarAberta = false;
    }
  }

  toggleSidebar(): void {
    this.sidebarAberta = !this.sidebarAberta;
  }

  fecharSidebar(): void {
    if (window.innerWidth < 900) {
      this.sidebarAberta = false;
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/admin/login']);
  }
}
