
import { Produto } from './produto.model';

export interface ItemPedido {
    id?: number;
    pedido_id?: number;
    produto_id: number;
    quantidade: number;
    valor_unitario: number;
    subtotal: number;
    produto?: Produto;
}
