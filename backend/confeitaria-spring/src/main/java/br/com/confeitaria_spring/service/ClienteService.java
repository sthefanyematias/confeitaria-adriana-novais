package br.com.confeitaria_spring.service;

import org.springframework.stereotype.Service;
import br.com.confeitaria_spring.model.entity.Cliente;
import br.com.confeitaria_spring.repository.ClienteRepository;
import java.util.List;

@Service
public class ClienteService {

    private final ClienteRepository repo;

    public ClienteService(ClienteRepository repo) { this.repo = repo; }

    private void validar(Cliente c) {
        if (c.getNome() == null || c.getNome().isBlank())
            throw new RuntimeException("nome do cliente é obrigatório");
        if (c.getEmail() == null || c.getEmail().isBlank())
            throw new RuntimeException("email do cliente é obrigatório");
    }

    public Cliente adicionar(Cliente cliente) {
        validar(cliente);
        return repo.save(cliente);
    }

    public List<Cliente> listar() { return repo.findAll(); }

    public Cliente buscarPorId(Long id) { return repo.findById(id).orElse(null); }

    public int editar(Long id, Cliente dados) {
        validar(dados);
        return repo.findById(id).map(c -> {
            c.setNome(dados.getNome());
            c.setEmail(dados.getEmail());
            c.setTelefone(dados.getTelefone());
            c.setAtivo(dados.getAtivo());
            repo.save(c);
            return 1;
        }).orElse(0);
    }

    public int deletar(Long id) {
        if (!repo.existsById(id)) return 0;
        repo.deleteById(id);
        return 1;
    }
}
