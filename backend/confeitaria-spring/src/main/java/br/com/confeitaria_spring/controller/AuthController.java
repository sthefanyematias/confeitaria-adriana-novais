
package br.com.confeitaria_spring.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import br.com.confeitaria_spring.model.request.LoginRequest;
import br.com.confeitaria_spring.model.response.LoginResponse;
import br.com.confeitaria_spring.service.AuthService;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            LoginResponse resp = service.login(req);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("erro", e.getMessage()));
        }
    }
}
