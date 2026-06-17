package br.com.confeitaria_spring.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import br.com.confeitaria_spring.model.entity.Cliente;
import br.com.confeitaria_spring.service.ClienteService;
import java.util.Map;

@RestController
@RequestMapping("/cliente")
public class ClienteController {

    private final ClienteService service;
    public ClienteController(ClienteService service) { this.service = service; }

    @PostMapping
    public ResponseEntity<?> adicionar(@RequestBody Cliente cliente) {
        try {
            Cliente salvo = service.adicionar(cliente);
            return ResponseEntity.ok(Map.of("mensagem", "cliente inserido", "novoId", salvo.getId()));
        } catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage())); }
    }

    @GetMapping
    public ResponseEntity<?> listar() {
        try { return ResponseEntity.ok(service.listar()); }
        catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage())); }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        try {
            Cliente c = service.buscarPorId(id);
            if (c == null) return ResponseEntity.status(404).body(Map.of("mensagem", "cliente não encontrado"));
            return ResponseEntity.ok(c);
        } catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage())); }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editar(@PathVariable Long id, @RequestBody Cliente cliente) {
        try {
            int rows = service.editar(id, cliente);
            if (rows == 0) return ResponseEntity.status(404).body(Map.of("mensagem", "cliente não encontrado"));
            return ResponseEntity.ok(Map.of("mensagem", "cliente atualizado"));
        } catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage())); }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        try {
            int rows = service.deletar(id);
            if (rows == 0) return ResponseEntity.status(404).body(Map.of("mensagem", "cliente não encontrado"));
            return ResponseEntity.ok(Map.of("mensagem", "cliente deletado"));
        } catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage())); }
    }
}
