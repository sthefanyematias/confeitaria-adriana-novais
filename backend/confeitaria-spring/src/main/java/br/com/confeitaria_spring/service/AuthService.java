package br.com.confeitaria_spring.service;

import org.springframework.stereotype.Service;
import br.com.confeitaria_spring.model.entity.AdminUsuario;
import br.com.confeitaria_spring.model.request.LoginRequest;
import br.com.confeitaria_spring.model.response.LoginResponse;
import br.com.confeitaria_spring.repository.AdminUsuarioRepository;
import br.com.confeitaria_spring.security.JwtUtil;

@Service
public class AuthService {

    private final AdminUsuarioRepository adminRepo;
    private final JwtUtil jwtUtil;

    public AuthService(AdminUsuarioRepository adminRepo, JwtUtil jwtUtil) {
        this.adminRepo = adminRepo;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse login(LoginRequest req) {
        if (req.getEmail() == null || req.getEmail().isBlank())
            throw new RuntimeException("email é obrigatório");
        if (req.getSenha() == null || req.getSenha().isBlank())
            throw new RuntimeException("senha é obrigatória");

        AdminUsuario admin = adminRepo
                .findByEmailAndSenha(req.getEmail(), req.getSenha())
                .orElseThrow(() -> new RuntimeException("email ou senha inválidos"));

        String token = jwtUtil.generateToken(admin);

        return new LoginResponse(
                token,
                new LoginResponse.AdminInfo(admin.getId(), admin.getNome(), admin.getEmail(), admin.getAtivo())
        );
    }
}