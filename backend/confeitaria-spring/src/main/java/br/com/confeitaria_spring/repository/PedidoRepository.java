package br.com.confeitaria_spring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import br.com.confeitaria_spring.model.entity.Pedido;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> { }

