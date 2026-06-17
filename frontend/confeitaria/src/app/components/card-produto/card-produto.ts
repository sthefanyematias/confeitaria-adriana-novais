
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Produto } from '../../core/models/produto.model';
import { CarrinhoService } from '../../core/services/carrinho.service';
import { ApiConfigService } from '../../core/services/api-config.service';

@Component({
  selector: 'app-card-produto',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './card-produto.html',
  styleUrl: './card-produto.css'
})
export class CardProduto implements OnInit {
  @Input() produto!: Produto;

  quantidade = 1;
  adicionado = false;
  imagemUrl = '';

  constructor(
    private carrinhoService: CarrinhoService,
    private apiConfig: ApiConfigService
  ) { }

  ngOnInit(): void {
    const imagem = this.produto.imagem_url || (this.produto as any).imagemUrl || '';
    this.imagemUrl = imagem ? this.apiConfig.getUrlImagemProduto(imagem) : '/images/produto-placeholder.png';
  }

  get semEstoque(): boolean {
    return this.produto.estoque <= 0;
  }

  get labelUnidade(): string {
    const tipo = this.produto.unidade_tipo;
    const qtd = this.produto.unidade_quantidade;

    if (!tipo || !qtd) return '';

    switch (tipo) {
      case 'unidade': return `${qtd} unidade${qtd > 1 ? 's' : ''}`;
      case 'kg': return `${qtd} kg`;
      case 'g': return `${qtd}g`;
      default: return '';
    }
  }

  formatarPreco(valor: number): string {
    return 'R$ ' + Number(valor).toFixed(2).replace('.', ',');
  }

  aumentar(): void {
    if (this.quantidade < this.produto.estoque) this.quantidade++;
  }

  diminuir(): void {
    if (this.quantidade > 1) this.quantidade--;
  }

  aoAlterarQuantidade(evento: Event): void {
    const valor = Number((evento.target as HTMLInputElement).value);
    if (valor >= 1 && valor <= this.produto.estoque) {
      this.quantidade = valor;
    } else {
      this.quantidade = Math.min(Math.max(1, valor), this.produto.estoque);
      (evento.target as HTMLInputElement).value = String(this.quantidade);
    }
  }

  adicionar(): void {
    this.carrinhoService.adicionar({
      produto_id: this.produto.id!,
      nome: this.produto.nome,
      preco: Number(this.produto.preco),
      quantidade: this.quantidade,
      imagem_url: this.produto.imagem_url,
      subtotal: Number(this.produto.preco) * this.quantidade
    });

    this.adicionado = true;
    this.quantidade = 1;
    setTimeout(() => (this.adicionado = false), 2000);
  }
}
