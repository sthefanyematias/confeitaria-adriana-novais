package br.com.confeitaria_spring.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import br.com.confeitaria_spring.model.entity.Pedido;
import br.com.confeitaria_spring.model.entity.StatusPedido;
import br.com.confeitaria_spring.model.request.PedidoRequest;
import br.com.confeitaria_spring.service.PedidoService;
import java.util.Map;

@RestController
@RequestMapping("/pedido")
public class PedidoController {

    private final PedidoService service;

    public PedidoController(PedidoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> adicionar(@RequestBody PedidoRequest req) {
        try {
            Long id = service.adicionar(req);
            return ResponseEntity.ok(Map.of("mensagem", "pedido criado", "novoId", id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> listar() {
        try {
            return ResponseEntity.ok(service.listar());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        try {
            Pedido pedido = service.buscarPorId(id);
            if (pedido == null) {
                return ResponseEntity.status(404).body(Map.of("mensagem", "pedido não encontrado"));
            }
            return ResponseEntity.ok(pedido);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editar(@PathVariable Long id, @RequestBody PedidoRequest req) {
        try {
            int rows = service.editar(id, req);
            if (rows == 0) {
                return ResponseEntity.status(404).body(Map.of("mensagem", "pedido não encontrado"));
            }
            return ResponseEntity.ok(Map.of("mensagem", "pedido atualizado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> atualizarStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            String statusStr = body.get("status");
            if (statusStr == null || statusStr.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("erro", "status é obrigatório"));
            }
            StatusPedido status = StatusPedido.fromValor(statusStr);
            int rows = service.atualizarStatus(id, status);
            if (rows == 0) {
                return ResponseEntity.status(404).body(Map.of("mensagem", "pedido não encontrado"));
            }
            return ResponseEntity.ok(Map.of("mensagem", "status atualizado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        try {
            int rows = service.deletar(id);
            if (rows == 0) {
                return ResponseEntity.status(404).body(Map.of("mensagem", "pedido não encontrado"));
            }
            return ResponseEntity.ok(Map.of("mensagem", "pedido deletado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }
}
