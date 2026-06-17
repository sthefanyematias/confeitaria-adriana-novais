package br.com.confeitaria_spring.model.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum FormaPagamento {
    PIX("pix"),
    CARTAO_CREDITO("cartao_credito"),
    CARTAO_DEBITO("cartao_debito");

    private final String valor;

    FormaPagamento(String valor) {
        this.valor = valor;
    }

    @JsonValue
    public String getValor() {
        return valor;
    }

    @JsonCreator
    public static FormaPagamento fromValor(String valor) {
        for (FormaPagamento f : values()) {
            if (f.valor.equals(valor)) return f;
        }
        throw new IllegalArgumentException("Forma de pagamento inválida: " + valor);
    }
}
