
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminLayout } from '../../../../components/admin-layout/admin-layout';
import { CategoriaService } from '../../../../core/services/categoria.service';
import { ModalService } from '../../../../core/services/modal.service';
import { Categoria } from '../../../../core/models/categoria.model';

@Component({
  selector: 'app-listar-categorias',
  standalone: true,
  imports: [AdminLayout, FormsModule],
  templateUrl: './listar.html',
  styleUrl: './listar.css'
})
export class ListarCategorias implements OnInit {
  categorias: Categoria[] = [];
  carregando = true;
  editandoId: number | null = null;
  nomeEdicao = '';
  descricaoEdicao = '';
  novoNome = '';
  novaDescricao = '';
  adicionando = false;

  constructor(
    private categoriaService: CategoriaService,
    private modal: ModalService
  ) { }

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.categoriaService.listar().subscribe({
      next: (cats) => {
        this.categorias = cats;
        this.carregando = false;
      },
      error: () => (this.carregando = false)
    });
  }

  iniciarEdicao(cat: Categoria): void {
    this.editandoId = cat.id!;
    this.nomeEdicao = cat.nome;
    this.descricaoEdicao = cat.descricao || '';
  }

  cancelarEdicao(): void {
    this.editandoId = null;
  }

  salvarEdicao(cat: Categoria): void {
    if (!this.nomeEdicao.trim()) {
      this.modal.aviso('Campo obrigatório', 'O nome da categoria é obrigatório.');
      return;
    }
    this.categoriaService.editar(cat.id!, {
      nome: this.nomeEdicao,
      descricao: this.descricaoEdicao,
      ativo: cat.ativo
    }).subscribe({
      next: () => {
        this.modal.sucesso('Salvo!', 'Categoria atualizada com sucesso.');
        this.editandoId = null;
        this.carregar();
      },
      error: (err) => this.modal.erro('Erro', err.error?.erro || 'Não foi possível salvar.')
    });
  }

  excluir(cat: Categoria): void {
    this.modal.confirmar(
      'Excluir categoria',
      `Deseja excluir "${cat.nome}"? Produtos vinculados não serão excluídos.`,
      () => {
        this.categoriaService.excluir(cat.id!).subscribe({
          next: () => {
            this.modal.sucesso('Excluída!', `"${cat.nome}" foi removida.`);
            this.carregar();
          },
          error: (err) => this.modal.erro('Erro', err.error?.erro || 'Não foi possível excluir.')
        });
      }
    );
  }

  adicionar(): void {
    if (!this.novoNome.trim()) {
      this.modal.aviso('Campo obrigatório', 'Informe o nome da categoria.');
      return;
    }
    this.adicionando = true;
    this.categoriaService.cadastrar({
      nome: this.novoNome,
      descricao: this.novaDescricao,
      ativo: true
    }).subscribe({
      next: () => {
        this.modal.sucesso('Adicionada!', 'Categoria cadastrada com sucesso.');
        this.novoNome = '';
        this.novaDescricao = '';
        this.adicionando = false;
        this.carregar();
      },
      error: (err) => {
        this.modal.erro('Erro', err.error?.erro || 'Não foi possível adicionar.');
        this.adicionando = false;
      }
    });
  }
}
