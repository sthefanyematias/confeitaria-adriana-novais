import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalService, ConfigModal } from '../../core/services/modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.html',
  styleUrl: './modal.css'
})
export class Modal implements OnInit, OnDestroy {
  config: ConfigModal | null = null;
  private sub!: Subscription;

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
    this.sub = this.modalService.estado$.subscribe((config) => {
      if (config) {
        this.config = {
          ...config,
          mensagem: this.tratarMensagemErro(config.mensagem)
        };
      } else {
        this.config = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private tratarMensagemErro(mensagem: string): string {
    if (!mensagem) return '';

    const msgLower = mensagem.toLowerCase();

    const ehViolacaoFK =
      msgLower.includes('foreign key constraint') ||
      msgLower.includes('constraint violation') ||
      msgLower.includes('a foreign key constraint fails') ||
      msgLower.includes('cannot delete or update a parent row');

    if (ehViolacaoFK) {
      return 'Não é possível excluir este registro pois ele está vinculado a outros dados (pedidos ou produtos).';
    }

    const ehViolacaoUnica =
      msgLower.includes('unique') ||
      msgLower.includes('duplicate entry') ||
      msgLower.includes('duplicate key');

    if (ehViolacaoUnica) {
      if (msgLower.includes('nome') || msgLower.includes('name')) {
        return 'Já existe um registro com este nome. Escolha um nome diferente.';
      }
      if (msgLower.includes('email')) {
        return 'Este e-mail já está cadastrado.';
      }
      return 'Já existe um registro com essas informações. Verifique os dados e tente novamente.';
    }

    const ehErroBanco =
      mensagem.includes('could not execute statement') ||
      mensagem.includes('Data truncation') ||
      mensagem.includes('SQL') ||
      mensagem.includes('insert into') ||
      mensagem.includes('update') && mensagem.includes('column');

    if (ehErroBanco) {
      if (mensagem.includes("column 'descricao'")) {
        return 'A descrição inserida é longa demais para o limite permitido. Por favor, resuma o texto.';
      }
      return 'Ocorreu um erro interno ao salvar os dados. Verifique as informações e tente novamente.';
    }

    return mensagem;
  }

  @HostListener('window:keydown', ['$event'])
  aoTeclar(e: KeyboardEvent): void {
    if (!this.config) return;
    if (e.key === 'Escape') {
      this.fecharSeFora();
    }
    if (e.key === 'Enter') {
      this.confirmar();
    }
  }

  confirmar(): void {
    const cb = this.config?.aoConfirmar;
    this.modalService.fechar();
    cb?.();
  }

  cancelar(): void {
    const cb = this.config?.aoCancelar;
    this.modalService.fechar();
    cb?.();
  }

  fecharSeFora(): void {
    if (this.config?.tipo !== 'confirmacao') {
      this.modalService.fechar();
    }
  }

  aoClicarBackdrop(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
      if (this.config?.tipo !== 'confirmacao') {
        this.modalService.fechar();
      }
    }
  }

  get iconeClasse(): string {
    const map: Record<string, string> = {
      sucesso: 'icone-sucesso',
      erro: 'icone-erro',
      aviso: 'icone-aviso',
      confirmacao: 'icone-confirmacao'
    };
    return this.config ? map[this.config.tipo] : '';
  }
}
