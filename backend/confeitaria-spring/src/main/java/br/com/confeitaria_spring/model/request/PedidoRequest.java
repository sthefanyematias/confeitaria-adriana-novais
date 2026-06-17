package br.com.confeitaria_spring.model.request;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import br.com.confeitaria_spring.model.entity.FormaPagamento;
import br.com.confeitaria_spring.model.entity.StatusPedido;

@Data
public class PedidoRequest {
    private Long clienteId;
    private LocalDateTime dataEntrega;
    private FormaPagamento formaPagamento;
    private StatusPedido status;
    private String observacao;
    private List<ItemPedidoRequest> itens;
}
