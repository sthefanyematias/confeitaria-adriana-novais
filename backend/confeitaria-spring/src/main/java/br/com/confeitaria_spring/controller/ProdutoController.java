
package br.com.confeitaria_spring.controller;

import br.com.confeitaria_spring.model.entity.Produto;
import br.com.confeitaria_spring.service.ProdutoService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    private final ProdutoService service;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public ProdutoController(ProdutoService service) {
        this.service = service;
    }

    private String mensagemSegura(Exception e) {
        return e.getMessage() != null ? e.getMessage() : "Erro interno no servidor";
    }

    private String salvarImagem(MultipartFile arquivo) throws IOException {
        Path pasta = Paths.get(uploadDir);
        if (!Files.exists(pasta)) Files.createDirectories(pasta);
        String ext = Optional.ofNullable(arquivo.getOriginalFilename())
                .filter(n -> n.contains("."))
                .map(n -> n.substring(n.lastIndexOf(".")))
                .orElse(".jpg").toLowerCase();
        String nome = "produto-" + UUID.randomUUID() + ext;
        arquivo.transferTo(pasta.resolve(nome));
        return nome;
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> adicionar(
            @RequestParam("categoria_id") Long categoriaId,
            @RequestParam("nome") String nome,
            @RequestParam(value = "descricao", required = false) String descricao,
            @RequestParam("preco") BigDecimal preco,
            @RequestParam("estoque") Integer estoque,
            @RequestParam(value = "destaque", defaultValue = "false") Boolean destaque,
            @RequestParam(value = "ativo", defaultValue = "true") Boolean ativo,
            @RequestParam(value = "unidade_tipo", required = false) String unidadeTipo,
            @RequestParam(value = "unidade_quantidade", required = false) Integer unidadeQuantidade,
            @RequestParam(value = "imagem", required = false) MultipartFile imagem) {
        try {
            Produto p = new Produto();
            p.setCategoriaId(categoriaId);
            p.setNome(nome);
            p.setDescricao(descricao);
            p.setPreco(preco);
            p.setEstoque(estoque);
            p.setDestaque(destaque != null ? destaque : false);
            p.setAtivo(ativo != null ? ativo : true);
            p.setUnidadeTipo(unidadeTipo);
            p.setUnidadeQuantidade(unidadeQuantidade);
            if (imagem != null && !imagem.isEmpty()) p.setImagemUrl(salvarImagem(imagem));
            Produto salvo = service.adicionar(p);
            return ResponseEntity.ok(Map.of("mensagem", "produto inserido", "novoId", salvo.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", mensagemSegura(e)));
        }
    }

    @GetMapping
    public ResponseEntity<?> listar(
            @RequestParam Optional<Boolean> ativo,
            @RequestParam Optional<Boolean> destaque,
            @RequestParam(name = "categoria_id") Optional<Long> categoriaId) {
        try {
            return ResponseEntity.ok(service.listar(
                    ativo.orElse(null),
                    destaque.orElse(null),
                    categoriaId.orElse(null)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", mensagemSegura(e)));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        try {
            Produto p = service.buscarPorId(id);
            if (p == null) return ResponseEntity.status(404).body(Map.of("mensagem", "produto não encontrado"));
            return ResponseEntity.ok(p);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", mensagemSegura(e)));
        }
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<?> editar(
            @PathVariable Long id,
            @RequestParam("categoria_id") Long categoriaId,
            @RequestParam("nome") String nome,
            @RequestParam(value = "descricao", required = false) String descricao,
            @RequestParam("preco") BigDecimal preco,
            @RequestParam("estoque") Integer estoque,
            @RequestParam(value = "destaque", defaultValue = "false") Boolean destaque,
            @RequestParam(value = "ativo", defaultValue = "true") Boolean ativo,
            @RequestParam(value = "unidade_tipo", required = false) String unidadeTipo,
            @RequestParam(value = "unidade_quantidade", required = false) Integer unidadeQuantidade,
            @RequestParam(value = "imagem_url", required = false) String imagemUrlExistente,
            @RequestParam(value = "imagem", required = false) MultipartFile imagem) {
        try {
            Produto p = new Produto();
            p.setCategoriaId(categoriaId);
            p.setNome(nome);
            p.setDescricao(descricao);
            p.setPreco(preco);
            p.setEstoque(estoque);
            p.setDestaque(destaque != null ? destaque : false);
            p.setAtivo(ativo != null ? ativo : true);
            p.setUnidadeTipo(unidadeTipo);
            p.setUnidadeQuantidade(unidadeQuantidade);
            if (imagem != null && !imagem.isEmpty()) {
                p.setImagemUrl(salvarImagem(imagem));
            } else {
                p.setImagemUrl(imagemUrlExistente);
            }
            int rows = service.editar(id, p);
            if (rows == 0) return ResponseEntity.status(404).body(Map.of("mensagem", "produto não encontrado"));
            return ResponseEntity.ok(Map.of("mensagem", "produto atualizado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", mensagemSegura(e)));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        try {
            int rows = service.deletar(id);
            if (rows == 0) return ResponseEntity.status(404).body(Map.of("mensagem", "produto não encontrado"));
            return ResponseEntity.ok(Map.of("mensagem", "produto deletado"));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body(Map.of("erro",
                    "Este produto não pode ser excluído pois está vinculado a pedidos existentes. Desative-o em vez de excluir."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", mensagemSegura(e)));
        }
    }
}
