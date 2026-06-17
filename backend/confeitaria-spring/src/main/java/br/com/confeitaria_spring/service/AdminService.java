package br.com.confeitaria_spring.service;

import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;
import br.com.confeitaria_spring.model.entity.AdminUsuario;
import br.com.confeitaria_spring.repository.AdminUsuarioRepository;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class AdminService {

    private final AdminUsuarioRepository repo;

    public AdminService(AdminUsuarioRepository repo) { this.repo = repo; }

    public AdminUsuario adicionar(AdminUsuario admin) {
        if (admin.getNome() == null || admin.getNome().isBlank()) throw new RuntimeException("nome do admin é obrigatório");
        if (admin.getEmail() == null || admin.getEmail().isBlank()) throw new RuntimeException("email do admin é obrigatório");
        if (admin.getSenha() == null || admin.getSenha().isBlank()) throw new RuntimeException("senha do admin é obrigatória");

        String senhaHash = DigestUtils.md5DigestAsHex(
                admin.getSenha().getBytes(StandardCharsets.UTF_8));
        admin.setSenha(senhaHash);

        return repo.save(admin);
    }

    public List<AdminUsuario> listar() { return repo.findAll(); }

    public AdminUsuario buscarPorId(Long id) { return repo.findById(id).orElse(null); }

    public int editar(Long id, AdminUsuario dados) {
        if (dados.getNome() == null || dados.getNome().isBlank()) throw new RuntimeException("nome do admin é obrigatório");
        if (dados.getEmail() == null || dados.getEmail().isBlank()) throw new RuntimeException("email do admin é obrigatório");
        return repo.findById(id).map(a -> {
            a.setNome(dados.getNome());
            a.setEmail(dados.getEmail());
            a.setAtivo(dados.getAtivo());
            repo.save(a);
            return 1;
        }).orElse(0);
    }

    public int deletar(Long id) {
        if (!repo.existsById(id)) return 0;
        repo.deleteById(id);
        return 1;
    }
}
