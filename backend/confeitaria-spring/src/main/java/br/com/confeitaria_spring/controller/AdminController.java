package br.com.confeitaria_spring.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.confeitaria_spring.model.entity.AdminUsuario;
import br.com.confeitaria_spring.service.AdminService;

import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminService service;
    public AdminController(AdminService service) { this.service = service; }

    @PostMapping
    public ResponseEntity<?> adicionar(@RequestBody AdminUsuario admin) {
        try {
            AdminUsuario salvo = service.adicionar(admin);
            return ResponseEntity.ok(Map.of("mensagem", "admin inserido com sucesso", "novoId", salvo.getId()));
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
            AdminUsuario a = service.buscarPorId(id);
            if (a == null) return ResponseEntity.status(404).body(Map.of("mensagem", "admin não encontrado"));
            return ResponseEntity.ok(a);
        } catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage())); }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editar(@PathVariable Long id, @RequestBody AdminUsuario admin) {
        try {
            int rows = service.editar(id, admin);
            if (rows == 0) return ResponseEntity.status(404).body(Map.of("mensagem", "admin não encontrado"));
            return ResponseEntity.ok(Map.of("mensagem", "admin atualizado com sucesso"));
        } catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage())); }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        try {
            int rows = service.deletar(id);
            if (rows == 0) return ResponseEntity.status(404).body(Map.of("mensagem", "admin não encontrado"));
            return ResponseEntity.ok(Map.of("mensagem", "admin deletado com sucesso"));
        } catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage())); }
    }
}
