package br.com.confeitaria_spring.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import br.com.confeitaria_spring.model.entity.Categoria;
import br.com.confeitaria_spring.service.CategoriaService;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    private final CategoriaService service;

    public CategoriaController(CategoriaService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> adicionar(@RequestBody Categoria categoria) {
        try {
            Categoria salva = service.adicionar(categoria);
            return ResponseEntity.ok(Map.of("mensagem", "categoria inserida", "novoId", salva.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> listar(@RequestParam Optional<Boolean> ativo) {
        try {
            return ResponseEntity.ok(service.listar(ativo.orElse(null)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        try {
            Categoria cat = service.buscarPorId(id);
            if (cat == null) return ResponseEntity.status(404).body(Map.of("mensagem", "categoria não encontrada"));
            return ResponseEntity.ok(cat);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editar(@PathVariable Long id, @RequestBody Categoria categoria) {
        try {
            int rows = service.editar(id, categoria);
            if (rows == 0) return ResponseEntity.status(404).body(Map.of("mensagem", "categoria não encontrada"));
            return ResponseEntity.ok(Map.of("mensagem", "categoria atualizada"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        try {
            int rows = service.deletar(id);
            if (rows == 0) return ResponseEntity.status(404).body(Map.of("mensagem", "categoria não encontrada"));
            return ResponseEntity.ok(Map.of("mensagem", "categoria deletada"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }
}
