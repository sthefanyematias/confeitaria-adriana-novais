
import { Categoria } from './categoria.model';

export interface Produto {
    id?: number;
    categoria_id: number;
    nome: string;
    descricao?: string;
    preco: number;
    estoque: number;
    imagem_url?: string;
    destaque: boolean;
    ativo: boolean;
    cadastro?: string;
    categoria?: Categoria;
    unidade_tipo?: 'unidade' | 'kg' | 'g';
    unidade_quantidade?: number;
}
