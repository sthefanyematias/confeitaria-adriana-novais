
package br.com.confeitaria_spring.service;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import br.com.confeitaria_spring.model.entity.Categoria;
import br.com.confeitaria_spring.model.entity.Produto;
import br.com.confeitaria_spring.repository.CategoriaRepository;
import br.com.confeitaria_spring.repository.ProdutoRepository;
import java.math.BigDecimal;
import java.util.List;

@Service
public class ProdutoService {

    private final ProdutoRepository repo;
    private final CategoriaRepository categoriaRepo;

    public ProdutoService(ProdutoRepository repo, CategoriaRepository categoriaRepo) {
        this.repo = repo;
        this.categoriaRepo = categoriaRepo;
    }

    private void validar(Produto p) {
        if (p.getCategoriaId() == null || p.getCategoriaId() <= 0)
            throw new RuntimeException("categoria do produto é obrigatória");
        if (p.getNome() == null || p.getNome().isBlank())
            throw new RuntimeException("nome do produto é obrigatório");
        if (p.getPreco() == null)
            throw new RuntimeException("preço do produto é obrigatório");
        if (p.getPreco().compareTo(BigDecimal.ZERO) < 0)
            throw new RuntimeException("preço do produto inválido");
        if (p.getEstoque() == null)
            throw new RuntimeException("estoque do produto é obrigatório");
        if (p.getEstoque() < 0)
            throw new RuntimeException("estoque do produto inválido");
    }

    public Produto adicionar(Produto produto) {
        validar(produto);
        Categoria cat = categoriaRepo.findById(produto.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("categoria não encontrada"));
        produto.setCategoria(cat);
        return repo.save(produto);
    }

    public List<Produto> listar(Boolean ativo, Boolean destaque, Long categoriaId) {
        Specification<Produto> spec = Specification.where(null);
        if (ativo != null) {
            spec = spec.and((root, q, cb) -> cb.equal(root.get("ativo"), ativo));
        }
        if (destaque != null) {
            spec = spec.and((root, q, cb) -> cb.equal(root.get("destaque"), destaque));
        }
        if (categoriaId != null) {
            spec = spec.and((root, q, cb) -> cb.equal(root.get("categoriaId"), categoriaId));
        }
        return repo.findAll(spec);
    }

    public Produto buscarPorId(Long id) {
        return repo.findById(id).orElse(null);
    }

    public int editar(Long id, Produto dados) {
        validar(dados);
        return repo.findById(id).map(p -> {
            Categoria cat = categoriaRepo.findById(dados.getCategoriaId())
                    .orElseThrow(() -> new RuntimeException("categoria não encontrada"));
            p.setCategoria(cat);
            p.setNome(dados.getNome());
            p.setDescricao(dados.getDescricao());
            p.setPreco(dados.getPreco());
            p.setEstoque(dados.getEstoque());
            p.setImagemUrl(dados.getImagemUrl());
            p.setDestaque(dados.getDestaque());
            p.setAtivo(dados.getAtivo());
            p.setUnidadeTipo(dados.getUnidadeTipo());
            p.setUnidadeQuantidade(dados.getUnidadeQuantidade());
            repo.save(p);
            return 1;
        }).orElse(0);
    }

    public int deletar(Long id) {
        if (!repo.existsById(id)) return 0;
        repo.deleteById(id);
        return 1;
    }
}