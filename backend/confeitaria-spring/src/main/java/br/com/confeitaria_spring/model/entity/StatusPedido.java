package br.com.confeitaria_spring.model.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum StatusPedido {
    PENDENTE("pendente"),
    CONFIRMADO("confirmado"),
    EM_PREPARO("em_preparo"),
    PRONTO("pronto"),
    ENTREGUE("entregue"),
    CANCELADO("cancelado");

    private final String valor;

    StatusPedido(String valor) {
        this.valor = valor;
    }

    @JsonValue
    public String getValor() {
        return valor;
    }

    @JsonCreator
    public static StatusPedido fromValor(String valor) {
        for (StatusPedido s : values()) {
            if (s.valor.equals(valor)) return s;
        }
        throw new IllegalArgumentException("Status do pedido inválido: " + valor);
    }
}
