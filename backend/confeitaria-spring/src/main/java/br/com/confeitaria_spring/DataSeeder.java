
package br.com.confeitaria_spring;

import br.com.confeitaria_spring.model.entity.AdminUsuario;
import br.com.confeitaria_spring.model.entity.Categoria;
import br.com.confeitaria_spring.model.entity.Produto;
import br.com.confeitaria_spring.repository.AdminUsuarioRepository;
import br.com.confeitaria_spring.repository.CategoriaRepository;
import br.com.confeitaria_spring.repository.ProdutoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.util.DigestUtils;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final AdminUsuarioRepository adminRepo;
    private final CategoriaRepository categoriaRepo;
    private final ProdutoRepository produtoRepo;

    public DataSeeder(AdminUsuarioRepository adminRepo,
                      CategoriaRepository categoriaRepo,
                      ProdutoRepository produtoRepo) {
        this.adminRepo = adminRepo;
        this.categoriaRepo = categoriaRepo;
        this.produtoRepo = produtoRepo;
    }

    @Override
    public void run(String... args) {
        seedAdmin();
        seedCategorias();
        seedProdutos();
    }

    private void seedAdmin() {
        if (adminRepo.count() > 0) return;
        AdminUsuario admin = new AdminUsuario();
        admin.setNome("Adriana Novais");
        admin.setEmail("adriana@novais.com");
        admin.setSenha(DigestUtils.md5DigestAsHex("1234".getBytes(StandardCharsets.UTF_8)));
        admin.setAtivo(true);
        adminRepo.save(admin);
    }

    private void seedCategorias() {
        if (categoriaRepo.count() > 0) return;
        categoriaRepo.saveAll(List.of(
            categoria("Bolos",       "Bolos artesanais para todas as ocasiões"),
            categoria("Tortas",      "Tortas doces irresistíveis"),
            categoria("Brigadeiros", "Brigadeiros gourmet em diversas opções"),
            categoria("Pudins",      "Pudins cremosos e saborosos")
        ));
    }

    private void seedProdutos() {
        if (produtoRepo.count() > 0) return;

        List<Categoria> cats = categoriaRepo.findAll();
        Categoria bolos       = cats.stream().filter(c -> c.getNome().equals("Bolos")).findFirst().orElseThrow();
        Categoria tortas      = cats.stream().filter(c -> c.getNome().equals("Tortas")).findFirst().orElseThrow();
        Categoria brigadeiros = cats.stream().filter(c -> c.getNome().equals("Brigadeiros")).findFirst().orElseThrow();
        Categoria pudins      = cats.stream().filter(c -> c.getNome().equals("Pudins")).findFirst().orElseThrow();

        produtoRepo.saveAll(List.of(
            produto("Bolo de Chocolate",      "Bolo de chocolate belga com recheio de ganache e cobertura de brigadeiro",  new BigDecimal("89.90"),  10, bolos,       true,  "bolo-chocolate.jpg",         "unidade", 1),
            produto("Bolo Red Velvet",        "Bolo red velvet com recheio e cobertura de cream cheese",                    new BigDecimal("95.00"),  8,  bolos,       true,  "bolo-red-velvet.jpg",        "unidade", 1),
            produto("Bolo de Morango",        "Bolo de baunilha com morangos frescos e chantilly artesanal",               new BigDecimal("92.00"),  6,  bolos,       false, "bolo-morango.webp",          "unidade", 1),
            produto("Bolo de Cenoura",        "Bolo de cenoura com cobertura de brigadeiro de chocolate",                  new BigDecimal("75.00"),  12, bolos,       false, "bolo-cenoura.jpg",           "unidade", 1),
            produto("Naked Cake",             "Bolo rústico com frutas vermelhas e chantilly",                             new BigDecimal("110.00"), 5,  bolos,       true,  "naked-cake.jpg",             "unidade", 1),

            produto("Torta de Limão",         "Torta de limão siciliano com merengue italiano tostado",                    new BigDecimal("65.00"),  10, tortas,      true,  "torta-limao.png",            "unidade", 1),
            produto("Torta de Maracujá",      "Torta cremosa de maracujá com calda de frutas",                            new BigDecimal("62.00"),  8,  tortas,      false, "torta-maracuja.jpg",         "unidade", 1),
            produto("Torta de Morango",       "Torta com creme de confeiteiro e morangos frescos",                        new BigDecimal("68.00"),  7,  tortas,      true,  "torta-morango.webp",         "unidade", 1),
            produto("Torta Holandesa",        "Torta holandesa clássica com creme e raspas de chocolate",                 new BigDecimal("72.00"),  6,  tortas,      false, "torta-holandesa.jpg",        "unidade", 1),

            produto("Brigadeiro Tradicional", "Caixa com 20 brigadeiros clássicos de chocolate",                          new BigDecimal("45.00"),  20, brigadeiros, true,  "brigadeiro-tradicional.jpg", "unidade", 20),
            produto("Brigadeiro de Pistache", "Caixa com 20 brigadeiros gourmet de pistache",                             new BigDecimal("65.00"),  15, brigadeiros, true,  "brigadeiro-pistache.jpeg",   "unidade", 20),
            produto("Brigadeiro de Oreo",     "Caixa com 20 brigadeiros recheados com biscoito Oreo",                     new BigDecimal("55.00"),  18, brigadeiros, false, "brigadeiro-oreo.webp",       "unidade", 20),
            produto("Brigadeiro de Maracujá", "Caixa com 20 brigadeiros de maracujá com cobertura crocante",              new BigDecimal("55.00"),  15, brigadeiros, false, "brigadeiro-maracuja.jpg",    "unidade", 20),

            produto("Pudim de Leite",         "Pudim de leite condensado clássico com calda de caramelo",                 new BigDecimal("38.00"),  15, pudins,      true,  "pudim-leite.jpg",            "unidade", 1),
            produto("Pudim de Chocolate",     "Pudim de chocolate com calda de chocolate belga",                          new BigDecimal("42.00"),  12, pudins,      false, "pudim-chocolate.jpg",        "unidade", 1),
            produto("Pudim de Coco",          "Pudim de coco fresco com calda de caramelo",                               new BigDecimal("40.00"),  10, pudins,      false, "pudim-coco.jpg",             "unidade", 1)
        ));
    }

    private Categoria categoria(String nome, String descricao) {
        Categoria c = new Categoria();
        c.setNome(nome);
        c.setDescricao(descricao);
        c.setAtivo(true);
        return c;
    }

    private Produto produto(String nome, String descricao, BigDecimal preco,
                            int estoque, Categoria categoria, boolean destaque,
                            String imagem, String unidadeTipo, Integer unidadeQuantidade) {
        Produto p = new Produto();
        p.setNome(nome);
        p.setDescricao(descricao);
        p.setPreco(preco);
        p.setEstoque(estoque);
        p.setCategoria(categoria);
        p.setDestaque(destaque);
        p.setAtivo(true);
        p.setImagemUrl(imagem);
        p.setUnidadeTipo(unidadeTipo);
        p.setUnidadeQuantidade(unidadeQuantidade);
        return p;
    }
}