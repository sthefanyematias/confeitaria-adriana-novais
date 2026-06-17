
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminLayout } from '../../../../components/admin-layout/admin-layout';
import { ProdutoService } from '../../../../core/services/produto.service';
import { CategoriaService } from '../../../../core/services/categoria.service';
import { ModalService } from '../../../../core/services/modal.service';
import { Categoria } from '../../../../core/models/categoria.model';

@Component({
  selector: 'app-cadastrar-produto',
  standalone: true,
  imports: [AdminLayout, RouterLink, ReactiveFormsModule],
  templateUrl: './cadastrar.html',
  styleUrl: './cadastrar.css'
})
export class CadastrarProduto implements OnInit {
  form!: FormGroup;
  categorias: Categoria[] = [];
  arquivoImagem: File | null = null;
  previewUrl = '';
  enviando = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private produtoService: ProdutoService,
    private categoriaService: CategoriaService,
    private modal: ModalService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      categoria_id: ['', Validators.required],
      descricao: [''],
      preco: ['', [Validators.required, Validators.min(0)]],
      estoque: ['', [Validators.required, Validators.min(0)]],
      unidade_tipo: [''],
      unidade_quantidade: [null],
      destaque: [false],
      ativo: [true]
    });

    this.categoriaService.listar().subscribe({
      next: (cats) => (this.categorias = cats),
      error: () => this.modal.erro('Erro', 'Não foi possível carregar as categorias.')
    });
  }

  invalido(campo: string): boolean {
    const c = this.form.get(campo);
    return !!(c && c.invalid && c.touched);
  }

  aoSelecionarImagem(event: Event): void {
    const input = event.target as HTMLInputElement;
    const arquivo = input.files?.[0];
    if (!arquivo) return;

    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(arquivo.type)) {
      this.modal.erro('Formato inválido', 'Use imagens JPEG, PNG ou WEBP.');
      return;
    }
    if (arquivo.size > 5 * 1024 * 1024) {
      this.modal.erro('Arquivo muito grande', 'Máximo 5 MB.');
      return;
    }

    this.arquivoImagem = arquivo;
    const reader = new FileReader();
    reader.onload = (e) => (this.previewUrl = e.target?.result as string);
    reader.readAsDataURL(arquivo);
  }

  salvar(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.enviando = true;
    const v = this.form.value;
    const fd = new FormData();

    fd.append('nome', v.nome);
    fd.append('categoria_id', v.categoria_id);
    fd.append('descricao', v.descricao || '');
    fd.append('preco', v.preco);
    fd.append('estoque', v.estoque);
    fd.append('destaque', v.destaque ? 'true' : 'false');
    fd.append('ativo', v.ativo ? 'true' : 'false');

    if (v.unidade_tipo) fd.append('unidade_tipo', v.unidade_tipo);
    if (v.unidade_quantidade) fd.append('unidade_quantidade', String(v.unidade_quantidade));

    if (this.arquivoImagem) fd.append('imagem', this.arquivoImagem);

    this.produtoService.cadastrar(fd).subscribe({
      next: () => {
        this.modal.sucesso('Produto cadastrado!', 'Adicionado com sucesso.', () => {
          this.router.navigate(['/admin/produtos']);
        });
      },
      error: (err) => {
        this.modal.erro('Erro ao cadastrar', err.error?.erro || 'Tente novamente.');
        this.enviando = false;
      }
    });
  }
}
