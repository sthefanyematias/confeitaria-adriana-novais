
export interface ItemCarrinho {
    produto_id: number;
    nome: string;
    preco: number;
    quantidade: number;
    imagem_url?: string;
    subtotal: number;
}
