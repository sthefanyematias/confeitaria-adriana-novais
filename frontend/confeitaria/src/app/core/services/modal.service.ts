
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ModalTipo = 'sucesso' | 'erro' | 'aviso' | 'confirmacao';

export interface ConfigModal {
    titulo: string;
    mensagem: string;
    tipo: ModalTipo;
    textoBotaoConfirmar?: string;
    textoBotaoCancelar?: string;
    aoConfirmar?: () => void;
    aoCancelar?: () => void;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
    private config$ = new BehaviorSubject<ConfigModal | null>(null);

    estado$ = this.config$.asObservable();

    abrir(config: ConfigModal): void {
        this.config$.next(config);
        document.body.style.overflow = 'hidden';
    }

    fechar(): void {
        this.config$.next(null);
        document.body.style.overflow = '';
    }

    sucesso(titulo: string, mensagem: string, aoConfirmar?: () => void): void {
        this.abrir({ titulo, mensagem, tipo: 'sucesso', aoConfirmar });
    }

    erro(titulo: string, mensagem: string): void {
        this.abrir({ titulo, mensagem, tipo: 'erro' });
    }

    aviso(titulo: string, mensagem: string): void {
        this.abrir({ titulo, mensagem, tipo: 'aviso' });
    }

    confirmar(
        titulo: string,
        mensagem: string,
        aoConfirmar: () => void,
        aoCancelar?: () => void
    ): void {
        this.abrir({
            titulo,
            mensagem,
            tipo: 'confirmacao',
            textoBotaoConfirmar: 'Confirmar',
            textoBotaoCancelar: 'Cancelar',
            aoConfirmar,
            aoCancelar
        });
    }
}
