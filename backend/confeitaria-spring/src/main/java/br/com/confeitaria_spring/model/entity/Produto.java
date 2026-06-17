
package br.com.confeitaria_spring.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "produto")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categoria_id", nullable = false)
    @JsonIgnoreProperties("hibernateLazyInitializer")
    private Categoria categoria;

    @Column(name = "categoria_id", insertable = false, updatable = false)
    private Long categoriaId;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(length = 255)
    private String descricao;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal preco;

    @Column(nullable = false)
    private Integer estoque = 0;

    @Column(name = "imagem_url", length = 255)
    private String imagemUrl;

    @Column(nullable = false)
    private Boolean destaque = false;

    @Column(nullable = false)
    private Boolean ativo = true;

    @Column(name = "unidade_tipo", length = 20)
    private String unidadeTipo;

    @Column(name = "unidade_quantidade")
    private Integer unidadeQuantidade;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime cadastro;
}
