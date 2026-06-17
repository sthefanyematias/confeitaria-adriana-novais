
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { AdminLayout } from '../../../../components/admin-layout/admin-layout';
import { ProdutoService } from '../../../../core/services/produto.service';
import { CategoriaService } from '../../../../core/services/categoria.service';
import { ModalService } from '../../../../core/services/modal.service';
import { ApiConfigService } from '../../../../core/services/api-config.service';
import { Produto } from '../../../../core/models/produto.model';
import { Categoria } from '../../../../core/models/categoria.model';

@Component({
  selector: 'app-editar-produto',
  standalone: true,
  imports: [AdminLayout, RouterLink, ReactiveFormsModule],
  templateUrl: './editar.html',
  styleUrl: './editar.css'
})
export class EditarProduto implements OnInit {
  form!: FormGroup;
  produto!: Produto;
  categorias: Categoria[] = [];
  arquivoImagem: File | null = null;
  previewUrl = '';
  carregando = true;
  enviando = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private produtoService: ProdutoService,
    private categoriaService: CategoriaService,
    private modal: ModalService,
    private apiConfig: ApiConfigService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    forkJoin({
      categorias: this.categoriaService.listar(),
      produto: this.produtoService.buscarPorId(id)
    }).subscribe({
      next: ({ categorias, produto }) => {
        this.categorias = categorias;
        this.produto = produto;

        const categoriaIdOriginal = Number(
          produto.categoria_id ?? (produto as any).categoriaId ?? produto.categoria?.id ?? ''
        ) || '';

        const nomeImagem = produto.imagem_url || (produto as any).imagemUrl || '';
        this.previewUrl = nomeImagem ? this.apiConfig.getUrlImagemProduto(nomeImagem) : '';

        this.form = this.fb.group({
          nome: [produto.nome, Validators.required],
          categoria_id: [categoriaIdOriginal, Validators.required],
          descricao: [produto.descricao || ''],
          preco: [produto.preco, [Validators.required, Validators.min(0)]],
          estoque: [produto.estoque, [Validators.required, Validators.min(0)]],
          unidade_tipo: [produto.unidade_tipo || ''],
          unidade_quantidade: [produto.unidade_quantidade || null],
          destaque: [produto.destaque === true || (produto as any).destaque === 1],
          ativo: [produto.ativo === true || (produto as any).ativo === 1]
        });

        this.carregando = false;
      },
      error: () => {
        this.modal.erro('Erro', 'Produto não encontrado.');
        this.router.navigate(['/admin/produtos']);
      }
    });
  }

  invalido(campo: string): boolean {
    const c = this.form?.get(campo);
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
    fd.append('categoria_id', String(v.categoria_id));
    fd.append('descricao', v.descricao || '');
    fd.append('preco', String(v.preco));
    fd.append('estoque', String(v.estoque));
    fd.append('destaque', v.destaque ? 'true' : 'false');
    fd.append('ativo', v.ativo ? 'true' : 'false');

    if (v.unidade_tipo) fd.append('unidade_tipo', v.unidade_tipo);
    if (v.unidade_quantidade) fd.append('unidade_quantidade', String(v.unidade_quantidade));

    if (this.arquivoImagem) {
      fd.append('imagem', this.arquivoImagem);
    } else {
      const nomeImagemOriginal = this.produto.imagem_url || (this.produto as any).imagemUrl || '';
      if (nomeImagemOriginal) {
        fd.append('imagem_url', nomeImagemOriginal);
        fd.append('imagemUrl', nomeImagemOriginal);
      }
    }

    this.produtoService.editar(this.produto.id!, fd).subscribe({
      next: () => {
        this.enviando = false;
        this.modal.sucesso('Alterações salvas!', 'Produto atualizado com sucesso.', () => {
          this.router.navigate(['/admin/produtos']);
        });
      },
      error: (err) => {
        this.modal.erro('Erro ao salvar', err.error?.erro || 'Tente novamente.');
        this.enviando = false;
      }
    });
  }
}
