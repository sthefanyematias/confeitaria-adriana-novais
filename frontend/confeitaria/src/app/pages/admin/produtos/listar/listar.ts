import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { AdminLayout } from '../../../../components/admin-layout/admin-layout';
import { ProdutoService } from '../../../../core/services/produto.service';
import { ModalService } from '../../../../core/services/modal.service';
import { ApiConfigService } from '../../../../core/services/api-config.service';
import { Produto } from '../../../../core/models/produto.model';

@Component({
  selector: 'app-listar-produtos',
  standalone: true,
  imports: [AdminLayout, RouterLink, FormsModule, CurrencyPipe],
  templateUrl: './listar.html',
  styleUrl: './listar.css'
})
export class ListarProdutos implements OnInit {
  todos: Produto[] = [];
  exibidos: Produto[] = [];
  busca = '';
  carregando = true;

  constructor(
    private produtoService: ProdutoService,
    private modal: ModalService,
    public apiConfig: ApiConfigService
  ) { }

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.produtoService.listar().subscribe({
      next: (p) => {
        this.todos = p;
        this.filtrar();
        this.carregando = false;
      },
      error: () => (this.carregando = false)
    });
  }

  filtrar(): void {
    const b = this.busca.toLowerCase().trim();
    this.exibidos = b
      ? this.todos.filter(p =>
        p.nome.toLowerCase().includes(b) ||
        (p.categoria?.nome || '').toLowerCase().includes(b)
      )
      : [...this.todos];
  }

  excluir(produto: Produto): void {
    this.modal.confirmar(
      'Excluir produto',
      `Deseja excluir "${produto.nome}" permanentemente?`,
      () => {
        this.produtoService.excluir(produto.id!).subscribe({
          next: () => {
            this.modal.sucesso('Excluído!', `"${produto.nome}" foi removido.`);
            this.carregar();
          },
          error: (err) => {
            this.modal.erro('Erro', err.error?.erro || 'Não foi possível excluir.');
          }
        });
      }
    );
  }
}