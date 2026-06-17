package br.com.confeitaria_spring.model.request;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ItemPedidoRequest {
    private Long produtoId;
    private Integer quantidade;
    private BigDecimal valorUnitario;
}
