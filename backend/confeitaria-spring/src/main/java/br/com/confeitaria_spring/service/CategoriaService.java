package br.com.confeitaria_spring.service;

import org.springframework.stereotype.Service;
import br.com.confeitaria_spring.model.entity.Categoria;
import br.com.confeitaria_spring.repository.CategoriaRepository;
import java.util.List;

@Service
public class CategoriaService {

    private final CategoriaRepository repo;

    public CategoriaService(CategoriaRepository repo) {
        this.repo = repo;
    }

    public Categoria adicionar(Categoria categoria) {
        if (categoria.getNome() == null || categoria.getNome().isBlank())
            throw new RuntimeException("nome da categoria é obrigatório");
        return repo.save(categoria);
    }

    public List<Categoria> listar(Boolean ativo) {
        if (ativo != null) {
            return repo.findByAtivo(ativo);
        }
        return repo.findAll();
    }

    public Categoria buscarPorId(Long id) {
        return repo.findById(id).orElse(null);
    }

    public int editar(Long id, Categoria dados) {
        if (dados.getNome() == null || dados.getNome().isBlank())
            throw new RuntimeException("nome da categoria é obrigatório");
        return repo.findById(id).map(cat -> {
            cat.setNome(dados.getNome());
            cat.setDescricao(dados.getDescricao());
            cat.setAtivo(dados.getAtivo());
            repo.save(cat);
            return 1;
        }).orElse(0);
    }

    public int deletar(Long id) {
        if (!repo.existsById(id)) return 0;
        repo.deleteById(id);
        return 1;
    }
}