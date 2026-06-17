
export interface Cliente {
    id?: number;
    nome: string;
    email: string;
    telefone?: string;
    ativo?: boolean;
    cadastro?: string;
}

export interface ClienteFormulario {
    nome: string;
    email: string;
    telefone: string;
}
