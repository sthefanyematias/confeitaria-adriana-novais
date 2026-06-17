package br.com.confeitaria_spring.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.confeitaria_spring.model.entity.Cliente;
import br.com.confeitaria_spring.model.entity.ItemPedido;
import br.com.confeitaria_spring.model.entity.Pedido;
import br.com.confeitaria_spring.model.entity.Produto;
import br.com.confeitaria_spring.model.entity.StatusPedido;
import br.com.confeitaria_spring.model.request.ItemPedidoRequest;
import br.com.confeitaria_spring.model.request.PedidoRequest;
import br.com.confeitaria_spring.repository.ClienteRepository;
import br.com.confeitaria_spring.repository.ItemPedidoRepository;
import br.com.confeitaria_spring.repository.PedidoRepository;
import br.com.confeitaria_spring.repository.ProdutoRepository;
import java.math.BigDecimal;
import java.util.List;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepo;
    private final ItemPedidoRepository itemRepo;
    private final ClienteRepository clienteRepo;
    private final ProdutoRepository produtoRepo;

    public PedidoService(PedidoRepository pedidoRepo, ItemPedidoRepository itemRepo,
            ClienteRepository clienteRepo, ProdutoRepository produtoRepo) {
        this.pedidoRepo = pedidoRepo;
        this.itemRepo = itemRepo;
        this.clienteRepo = clienteRepo;
        this.produtoRepo = produtoRepo;
    }

    @Transactional
    public Long adicionar(PedidoRequest req) {
        if (req.getClienteId() == null || req.getClienteId() <= 0) {
            throw new RuntimeException("cliente do pedido é obrigatório");
        }
        if (req.getFormaPagamento() == null) {
            throw new RuntimeException("forma de pagamento inválida");
        }
        if (req.getItens() == null || req.getItens().isEmpty()) {
            throw new RuntimeException("o pedido deve ter ao menos um item");
        }

        for (ItemPedidoRequest item : req.getItens()) {
            if (item.getProdutoId() == null || item.getProdutoId() <= 0) {
                throw new RuntimeException("produto do item é obrigatório");
            }
            if (item.getQuantidade() == null || item.getQuantidade() <= 0) {
                throw new RuntimeException("quantidade do item inválida");
            }
            if (item.getValorUnitario() == null || item.getValorUnitario().compareTo(BigDecimal.ZERO) < 0) {
                throw new RuntimeException("valor unitário inválido");
            }
        }

        Cliente cliente = clienteRepo.findById(req.getClienteId())
                .orElseThrow(() -> new RuntimeException("cliente não encontrado"));

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setDataEntrega(req.getDataEntrega());
        pedido.setFormaPagamento(req.getFormaPagamento());
        pedido.setStatus(req.getStatus() != null ? req.getStatus() : StatusPedido.PENDENTE);
        pedido.setObservacao(req.getObservacao());

        BigDecimal total = req.getItens().stream()
                .map(i -> i.getValorUnitario().multiply(BigDecimal.valueOf(i.getQuantidade())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        pedido.setValorTotal(total);

        Pedido salvo = pedidoRepo.save(pedido);

        for (ItemPedidoRequest itemReq : req.getItens()) {
            Produto produto = produtoRepo.findById(itemReq.getProdutoId())
                    .orElseThrow(() -> new RuntimeException("produto não encontrado"));

            ItemPedido item = new ItemPedido();
            item.setPedido(salvo);
            item.setProduto(produto);
            item.setQuantidade(itemReq.getQuantidade());
            item.setValorUnitario(itemReq.getValorUnitario());
            item.setSubtotal(itemReq.getValorUnitario()
                    .multiply(BigDecimal.valueOf(itemReq.getQuantidade())));
            itemRepo.save(item);
        }

        return salvo.getId();
    }

    public List<Pedido> listar() {
        return pedidoRepo.findAll();
    }

    public Pedido buscarPorId(Long id) {
        Pedido pedido = pedidoRepo.findById(id).orElse(null);
        if (pedido != null) {
            pedido.setItens(itemRepo.findByPedidoId(id));
        }
        return pedido;
    }

    @Transactional
    public int editar(Long id, PedidoRequest req) {
        if (req.getClienteId() == null || req.getClienteId() <= 0) {
            throw new RuntimeException("cliente do pedido é obrigatório");
        }
        if (req.getFormaPagamento() == null) {
            throw new RuntimeException("forma de pagamento inválida");
        }
        if (req.getItens() == null || req.getItens().isEmpty()) {
            throw new RuntimeException("o pedido deve ter ao menos um item");
        }

        for (ItemPedidoRequest item : req.getItens()) {
            if (item.getProdutoId() == null || item.getProdutoId() <= 0) {
                throw new RuntimeException("produto do item é obrigatório");
            }
            if (item.getQuantidade() == null || item.getQuantidade() <= 0) {
                throw new RuntimeException("quantidade do item inválida");
            }
            if (item.getValorUnitario() == null || item.getValorUnitario().compareTo(BigDecimal.ZERO) < 0) {
                throw new RuntimeException("valor unitário inválido");
            }
        }

        return pedidoRepo.findById(id).map(pedido -> {
            Cliente cliente = clienteRepo.findById(req.getClienteId())
                    .orElseThrow(() -> new RuntimeException("cliente não encontrado"));

            BigDecimal total = req.getItens().stream()
                    .map(i -> i.getValorUnitario().multiply(BigDecimal.valueOf(i.getQuantidade())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            pedido.setCliente(cliente);
            pedido.setDataEntrega(req.getDataEntrega());
            pedido.setFormaPagamento(req.getFormaPagamento());
            pedido.setStatus(req.getStatus());
            pedido.setObservacao(req.getObservacao());
            pedido.setValorTotal(total);
            pedidoRepo.save(pedido);

            itemRepo.deleteByPedidoId(id);

            for (ItemPedidoRequest itemReq : req.getItens()) {
                Produto produto = produtoRepo.findById(itemReq.getProdutoId())
                        .orElseThrow(() -> new RuntimeException("produto não encontrado"));

                ItemPedido item = new ItemPedido();
                item.setPedido(pedido);
                item.setProduto(produto);
                item.setQuantidade(itemReq.getQuantidade());
                item.setValorUnitario(itemReq.getValorUnitario());
                item.setSubtotal(itemReq.getValorUnitario()
                        .multiply(BigDecimal.valueOf(itemReq.getQuantidade())));
                itemRepo.save(item);
            }
            return 1;
        }).orElse(0);
    }

    public int atualizarStatus(Long id, StatusPedido status) {
        return pedidoRepo.findById(id).map(pedido -> {
            pedido.setStatus(status);
            pedidoRepo.save(pedido);
            return 1;
        }).orElse(0);
    }

    @Transactional
    public int deletar(Long id) {
        if (!pedidoRepo.existsById(id)) {
            return 0;
        }
        itemRepo.deleteByPedidoId(id);
        pedidoRepo.deleteById(id);
        return 1;
    }
}
