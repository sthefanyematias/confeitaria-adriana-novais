
import { Cliente } from './cliente.model';
import { ItemPedido } from './item-pedido.model';

export type FormaPagamento = 'pix' | 'cartao_credito' | 'cartao_debito';

export type StatusPedido =
    | 'pendente'
    | 'confirmado'
    | 'em_preparo'
    | 'pronto'
    | 'entregue'
    | 'cancelado';

export const STATUS_LABEL: Record<StatusPedido, string> = {
    pendente: 'Pendente',
    confirmado: 'Confirmado',
    em_preparo: 'Em Preparo',
    pronto: 'Pronto',
    entregue: 'Entregue',
    cancelado: 'Cancelado'
};

export const PAGAMENTO_LABEL: Record<FormaPagamento, string> = {
    pix: 'PIX',
    cartao_credito: 'Cartao de Credito',
    cartao_debito: 'Cartao de Debito'
};

export interface Pedido {
    id?: number;
    cliente_id: number;
    data_pedido?: string;
    data_entrega?: string;
    valor_total: number;
    forma_pagamento: FormaPagamento;
    status: StatusPedido;
    observacao?: string;
    cadastro?: string;
    itens?: ItemPedido[];
    cliente?: Cliente;
}
