import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AdminLayout } from '../../../components/admin-layout/admin-layout';
import { PedidoService } from '../../../core/services/pedido.service';
import { Pedido, StatusPedido, FormaPagamento, STATUS_LABEL, PAGAMENTO_LABEL } from '../../../core/models/pedido.model';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [AdminLayout, CommonModule, FormsModule],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css'
})
export class Pedidos implements OnInit, OnDestroy {
  todos: Pedido[] = [];
  exibidos: Pedido[] = [];
  carregando = true;
  termoBusca = '';
  filtroStatus = '';
  pedidoSelecionado: Pedido | null = null;
  salvandoStatus = false;
  private subs: Subscription[] = [];

  readonly todosStatus: { valor: StatusPedido; label: string }[] = [
    { valor: 'pendente', label: 'Pendente' },
    { valor: 'confirmado', label: 'Confirmado' },
    { valor: 'em_preparo', label: 'Em Preparo' },
    { valor: 'pronto', label: 'Pronto' },
    { valor: 'entregue', label: 'Entregue' },
    { valor: 'cancelado', label: 'Cancelado' }
  ];

  constructor(private pedidoService: PedidoService) { }

  ngOnInit(): void {
    this.carregarPedidos();
    this.iniciarPolling();
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  private carregarPedidos(): void {
    this.subs.push(
      this.pedidoService.listar().subscribe({
        next: (pedidos) => {
          this.todos = pedidos;
          this.filtrar();
          this.carregando = false;
        },
        error: () => (this.carregando = false)
      })
    );
  }

  private iniciarPolling(): void {
    this.subs.push(
      this.pedidoService.polling(10000).subscribe({
        next: (pedidos) => {
          this.todos = pedidos;
          this.filtrar();
          this.carregando = false;
        },
        error: () => { }
      })
    );
  }

  filtrar(): void {
    let lista = [...this.todos];

    if (this.filtroStatus) {
      lista = lista.filter(p => p.status === this.filtroStatus);
    }

    if (this.termoBusca.trim()) {
      const termo = this.termoBusca.toLowerCase();
      lista = lista.filter(p =>
        String(p.id).includes(termo) ||
        this.nomeCliente(p).toLowerCase().includes(termo)
      );
    }

    this.exibidos = lista;
  }

  abrirDetalhes(pedido: Pedido): void {
    this.subs.push(
      this.pedidoService.buscarPorId(pedido.id!).subscribe({
        next: (completo) => (this.pedidoSelecionado = completo),
        error: () => (this.pedidoSelecionado = pedido)
      })
    );
  }

  fecharDetalhes(): void {
    this.pedidoSelecionado = null;
    this.salvandoStatus = false;
  }

  atualizarStatus(pedido: Pedido, status: StatusPedido): void {
    if (pedido.status === status || this.salvandoStatus) return;
    this.salvandoStatus = true;
    this.subs.push(
      this.pedidoService.atualizarStatus(pedido.id!, status).subscribe({
        next: () => {
          pedido.status = status;

          const selecionado = this.pedidoSelecionado;
          if (selecionado && selecionado.id === pedido.id) {
            selecionado.status = status;
          }

          const idx = this.todos.findIndex(p => p.id === pedido.id);
          if (idx !== -1) this.todos[idx].status = status;

          this.filtrar();
          this.salvandoStatus = false;
        },
        error: () => (this.salvandoStatus = false)
      })
    );
  }

  nomeCliente(pedido: Pedido): string {
    return (pedido.cliente as any)?.nome || `Cliente #${pedido.cliente_id}`;
  }

  formatarData(data?: string): string {
    if (!data) return '—';
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  formatarPreco(valor: number): string {
    return 'R$ ' + Number(valor).toFixed(2).replace('.', ',');
  }

  statusLabel(status: StatusPedido): string {
    return STATUS_LABEL[status] || status;
  }

  pagamentoLabel(forma: FormaPagamento): string {
    return PAGAMENTO_LABEL[forma] || forma;
  }

  badgeStatus(status: StatusPedido): string {
    const map: Record<string, string> = {
      pendente: 'badge-pendente',
      confirmado: 'badge-confirmado',
      em_preparo: 'badge-preparo',
      pronto: 'badge-pronto',
      entregue: 'badge-ativo',
      cancelado: 'badge-inativo'
    };
    return map[status] || '';
  }
}
