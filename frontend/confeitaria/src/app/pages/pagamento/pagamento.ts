import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CarrinhoService } from '../../core/services/carrinho.service';
import { PedidoService } from '../../core/services/pedido.service';
import { ClienteService } from '../../core/services/cliente.service';
import { ModalService } from '../../core/services/modal.service';
import { ItemCarrinho } from '../../core/models/carrinho.model';
import { FormaPagamento } from '../../core/models/pedido.model';

@Component({
    selector: 'app-pagamento',
    standalone: true,
    imports: [RouterLink, ReactiveFormsModule],
    templateUrl: './pagamento.html',
    styleUrl: './pagamento.css'
})
export class Pagamento implements OnInit, OnDestroy {
    form!: FormGroup;
    formaPagamento: FormaPagamento | null = null;
    itens: ItemCarrinho[] = [];
    total = 0;
    enviando = false;
    private subs: Subscription[] = [];

    readonly WHATSAPP_NUMERO = '5511958908798';

    readonly formas = [
        {
            valor: 'pix' as FormaPagamento,
            rotulo: 'PIX',
            descricao: 'Transferência instantânea',
        },
        {
            valor: 'cartao_debito' as FormaPagamento,
            rotulo: 'Cartão de Débito',
            descricao: 'Débito na hora',
            cor: '#1A1A2E'
        },
        {
            valor: 'cartao_credito' as FormaPagamento,
            rotulo: 'Cartão de Crédito',
            descricao: 'Parcelamento disponível',
            cor: '#E79FA4'
        }
    ];

    constructor(
        private fb: FormBuilder,
        private carrinhoService: CarrinhoService,
        private pedidoService: PedidoService,
        private clienteService: ClienteService,
        private modal: ModalService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.itens = this.carrinhoService.itens;
        this.total = this.carrinhoService.totalValor;

        if (this.itens.length === 0) {
            this.router.navigate(['/carrinho']);
            return;
        }

        this.form = this.fb.group({
            nome: [
                '',
                [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.pattern(/^[a-zA-ZÀ-ÿ\s]{3,}$/)
                ]
            ],
            email: [
                '',
                [
                    Validators.required,
                    Validators.pattern(/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/)
                ]
            ],
            observacao: ['']
        });
    }

    ngOnDestroy(): void {
        this.subs.forEach((s) => s.unsubscribe());
    }

    selecionarForma(forma: FormaPagamento): void {
        this.formaPagamento = forma;
    }

    campoInvalido(campo: string): boolean {
        const c = this.form.get(campo);
        return !!(c && c.invalid && c.touched);
    }

    get podeEnviar(): boolean {
        return this.form.valid && !!this.formaPagamento && !this.enviando;
    }

    finalizarPedido(): void {
        this.form.markAllAsTouched();

        if (this.form.invalid) {
            this.modal.aviso('Campos obrigatórios', 'Preencha seus dados corretamente antes de continuar.');
            return;
        }

        if (!this.formaPagamento) {
            this.modal.aviso('Forma de pagamento', 'Selecione uma forma de pagamento para continuar.');
            return;
        }

        this.enviando = true;
        const dados = this.form.value;

        this.clienteService.cadastrar({
            nome: dados.nome,
            email: dados.email
        }).subscribe({
            next: (res) => this.registrarPedido(res.novoId, dados),
            error: () => {
                this.clienteService.listar().subscribe({
                    next: (clientes) => {
                        const existente = clientes.find(c => c.email === dados.email);
                        if (existente?.id) {
                            this.registrarPedido(existente.id, dados);
                        } else {
                            this.abrirWhatsApp(dados);
                        }
                    },
                    error: () => this.abrirWhatsApp(dados)
                });
            }
        });
    }

    private registrarPedido(clienteId: number | undefined, dados: any): void {
        if (!clienteId) {
            this.abrirWhatsApp(dados);
            return;
        }

        this.pedidoService.criar({
            cliente_id: clienteId,
            valor_total: this.total,
            forma_pagamento: this.formaPagamento!,
            status: 'pendente',
            observacao: dados.observacao || '',
            itens: this.itens.map((i) => ({
                produto_id: i.produto_id,
                quantidade: i.quantidade,
                valor_unitario: i.preco,
                subtotal: i.subtotal
            })) as any
        }).subscribe({
            next: () => this.abrirWhatsApp(dados),
            error: () => this.abrirWhatsApp(dados)
        });
    }

    private abrirWhatsApp(dados: {
        nome: string;
        email: string;
        observacao?: string;
    }): void {
        const formaLabel =
            this.formas.find((f) => f.valor === this.formaPagamento)?.rotulo || '';

        const itensTexto = this.itens
            .map(
                (i) =>
                    `• ${i.nome} (x${i.quantidade}) — R$ ${i.subtotal.toFixed(2).replace('.', ',')}`
            )
            .join('\n');

        const linhas = [
            `Olá Adriana! Gostaria de fazer um pedido.`,
            ``,
            `*Meus dados:*`,
            `Nome: ${dados.nome}`,
            `E-mail: ${dados.email}`,
            ``,
            `*Itens do pedido:*`,
            itensTexto,
            ``,
            `*Total: R$ ${this.total.toFixed(2).replace('.', ',')}*`,
            `Forma de pagamento: ${formaLabel}`,
            dados.observacao ? `\nObservação: ${dados.observacao}` : '',
            ``,
            `Aguardo seu retorno!`
        ];

        const mensagem = encodeURIComponent(linhas.filter(Boolean).join('\n'));
        window.open(`https://wa.me/${this.WHATSAPP_NUMERO}?text=${mensagem}`, '_blank');
        this.carrinhoService.limpar();
        this.enviando = false;
        this.router.navigate(['/home']);
    }

    formatarPreco(valor: number): string {
        return 'R$ ' + valor.toFixed(2).replace('.', ',');
    }
}
