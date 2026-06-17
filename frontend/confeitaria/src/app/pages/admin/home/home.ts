import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { AdminLayout } from '../../../components/admin-layout/admin-layout';
import { ProdutoService } from '../../../core/services/produto.service';
import { PedidoService } from '../../../core/services/pedido.service';
import { Produto } from '../../../core/models/produto.model';
import { Pedido, STATUS_LABEL, PAGAMENTO_LABEL, StatusPedido, FormaPagamento } from '../../../core/models/pedido.model';

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [AdminLayout, RouterLink, CurrencyPipe, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeAdmin implements OnInit {
  produtos: Produto[] = [];
  todosProdutos: Produto[] = [];
  pedidos: Pedido[] = [];
  carregando = true;
  carregandoPedidos = true;

  get totalProdutos(): number { return this.todosProdutos.length; }
  get produtosAtivos(): number { return this.todosProdutos.filter(p => p.ativo).length; }
  get produtosDestaque(): number { return this.todosProdutos.filter(p => p.destaque).length; }
  get totalEstoque(): number { return this.todosProdutos.reduce((acc, p) => acc + (Number(p.estoque) || 0), 0); }

  constructor(
    private produtoService: ProdutoService,
    private pedidoService: PedidoService
  ) { }

  ngOnInit(): void {
    this.produtoService.listar().subscribe({
      next: (p) => {
        this.todosProdutos = p;
        this.produtos = p.slice(0, 5);
        this.carregando = false;
      },
      error: () => (this.carregando = false)
    });

    this.pedidoService.listar().subscribe({
      next: (p) => {
        this.pedidos = p.slice().reverse().slice(0, 10);
        this.carregandoPedidos = false;
      },
      error: () => (this.carregandoPedidos = false)
    });
  }

  statusLabel(status: StatusPedido): string {
    return STATUS_LABEL[status] || status;
  }

  pagamentoLabel(forma: FormaPagamento): string {
    return PAGAMENTO_LABEL[forma] || forma;
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