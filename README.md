
# Confeitaria Adriana Novais: Sistema de E-Commerce e Gestão

Aplicação web full-stack desenvolvida para a confeitaria artesanal Adriana Novais. O sistema contempla uma vitrine pública voltada ao cliente final, com catálogo de produtos, carrinho de compras e fluxo de pedido integrado ao WhatsApp, além de um painel administrativo completo para gestão de produtos, categorias, pedidos e usuários. A aplicação está implantada em produção com backend containerizado no Render e banco de dados relacional hospedado na Clever Cloud.

<br>

## Visão Geral

A aplicação é composta por dois projetos independentes que se comunicam via API REST:

- **Backend:** API RESTful desenvolvida em Spring Boot, responsável pela persistência de dados, autenticação, upload de imagens e controle de regras de negócio. Empacotada em imagem Docker e implantada no Render.
- **Frontend:** SPA desenvolvida em Angular com componentes standalone, consumindo a API e oferecendo interfaces distintas para o cliente final e para o administrador.

<br>

## Tecnologias

**Backend**

| Tecnologia | Versão |
|---|---|
| Java | 17 |
| Spring Boot | 3.2.5 |
| Spring Data JPA | gerenciado pelo Spring Boot |
| Spring Security | gerenciado pelo Spring Boot |
| JJWT | 0.12.3 |
| SpringDoc OpenAPI | 2.5.0 |
| MySQL Connector/J | gerenciado pelo Spring Boot |
| Lombok | gerenciado pelo Spring Boot |
| Spring Boot Validation | gerenciado pelo Spring Boot |
| Docker | multi-stage build |

**Frontend**

| Tecnologia | Versão |
|---|---|
| Angular | 21.2.0 |
| TypeScript | 5.9.2 |
| RxJS | 7.8.0 |
| zone.js | 0.16.2 |
| tslib | 2.3.0 |
| Angular CLI | 21.2.7 |

**Infraestrutura**

| Serviço | Finalidade |
|---|---|
| Render | Hospedagem do backend containerizado |
| Clever Cloud | Banco de dados MySQL gerenciado |

<br>

## Funcionalidades

**Área Pública (cliente)**

- Página inicial com apresentação da confeitaria
- Catálogo de produtos com filtragem por categoria e atualização via polling a cada 5 segundos
- Página de detalhe do produto com controle de quantidade, validação de estoque e feedback visual de adição ao carrinho
- Carrinho de compras persistido em memória durante a sessão
- Fluxo de finalização de pedido com coleta de dados do cliente, seleção de forma de pagamento (PIX, cartão de débito ou crédito) e redirecionamento para o WhatsApp com resumo formatado
- Registro automático do pedido na base de dados antes do redirecionamento; em caso de falha na API, o fluxo do WhatsApp é preservado
- Página institucional com história, galeria e valores da confeitaria

**Painel Administrativo**

- Autenticação protegida por JWT com guard de rota no Angular
- Dashboard administrativo
- CRUD completo de produtos com upload de imagem
- CRUD de categorias com controle de status ativo/inativo
- Gestão de pedidos
- Gestão de usuários administradores

**Documentação da API**

A documentação interativa dos endpoints está disponível via Swagger UI em `/swagger-ui.html`, gerada automaticamente pelo SpringDoc OpenAPI. A especificação OpenAPI 3.0 pode ser acessada em `/v3/api-docs`.

<br>

## Arquitetura da API

A API segue o padrão REST com separação em camadas: `Controller → Service → Repository`. A autenticação utiliza Spring Security com um filtro customizado (`JwtAuthFilter`) que intercepta as requisições, valida o token JWT e popula o contexto de segurança. A configuração de segurança suporta tanto os prefixos diretos quanto os prefixos `/api/*`, garantindo compatibilidade com o proxy reverso do Render.

**Endpoints disponíveis**

| Método | Rota | Descrição | Autenticação |
|---|---|---|---|
| `POST` | `/admin/login` | Autenticação do administrador | Pública |
| `GET/POST/PUT/DELETE` | `/admin/{id}` | Gestão de usuários admin | Protegida |
| `GET/POST/PUT/DELETE` | `/categorias/{id}` | Gestão de categorias | Mista |
| `GET/POST/PUT/DELETE` | `/cliente/{id}` | Gestão de clientes | Mista |
| `GET/POST/PUT/DELETE` | `/pedido/{id}` | Gestão de pedidos | Mista |
| `GET/POST/PUT/DELETE` | `/produtos/{id}` | Gestão de produtos | Mista |
| `GET` | `/images/**` | Servir imagens enviadas por upload | Pública |
| `GET` | `/swagger-ui/**` | Documentação interativa | Pública |
| `GET` | `/v3/api-docs/**` | Especificação OpenAPI | Pública |

<br>

## Segurança

- Autenticação baseada em JWT com assinatura por chave secreta configurável via `application.properties`
- Filtro de autenticação stateless integrado ao `SecurityFilterChain` do Spring Security
- Senhas armazenadas com hash BCrypt
- CORS configurado via `CorsConfigurationSource` com suporte a todos os métodos HTTP necessários
- Rotas administrativas do Angular protegidas por `AuthGuard` que verifica a presença e validade do token no cliente
- Liberação explícita de extensões de arquivos estáticos (`.jpg`, `.png`, `.webp`, `.jpeg`) e dos caminhos `/images/**` e `/public/**` para prevenir bloqueio HTTP 403 em ambiente de produção

<br>

## Containerização

O backend é empacotado com um Dockerfile de multi-stage build, separando a fase de compilação Maven da fase de execução com JRE mínimo:

```dockerfile
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
COPY --from=build /app/public ./public
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

A cópia explícita da pasta `public/` no estágio final garante que as imagens dos produtos estejam disponíveis no sistema de arquivos do container em runtime, uma vez que o Render não compartilha volumes entre builds.

<br>

## Configuração e Execução

**Pré-requisitos**

- Java 17 ou superior
- Maven 3.8+
- MySQL 8+
- Node.js 18+ e npm
- Angular CLI 21+
- Docker (para execução containerizada)

**Backend — execução local**

Configure o arquivo `src/main/resources/application.properties` com os dados do seu ambiente. O projeto mantém as configurações de desenvolvimento comentadas no próprio arquivo para referência:

```properties
server.port=8080

spring.datasource.url=jdbc:mysql://localhost:3306/confeitaria?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=SEU_USUARIO
spring.datasource.password=SUA_SENHA
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jackson.property-naming-strategy=SNAKE_CASE
spring.jpa.hibernate.naming.physical-strategy=org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl

jwt.secret=SUA_CHAVE_SECRETA_JWT

spring.servlet.multipart.enabled=true
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=10MB
app.upload.dir=public/images
```

```bash
mvn spring-boot:run
```

A API estará disponível em `http://localhost:8080`.

**Backend — execução com Docker**

```bash
docker build -t confeitaria-api .
docker run -p 8080:8080 confeitaria-api
```

**Frontend — execução local**

Para apontar o frontend para a API local, edite `src/app/core/config/api.config.ts` e substitua o valor da propriedade `spring`:

```typescript
export const API_URLS: Record<ApiTipo, string> = {
    manual: 'http://localhost:3000',
    spring: 'http://localhost:8080'
};
```

Em seguida, instale as dependências e inicie o servidor de desenvolvimento:

```bash
npm install
ng serve
```

A aplicação estará disponível em `http://localhost:4200`.

Para build de produção:

```bash
ng build --configuration production
```

<br>

## Deploy em Produção

**Backend — Render**

O backend é implantado no Render a partir da imagem Docker gerada pelo `Dockerfile` na raiz do projeto. O Render executa o build e inicia o container automaticamente a cada push na branch principal.

Ajustes realizados para compatibilidade com o ambiente de nuvem:

- As propriedades `<start-class>` no bloco `<properties>` e `<mainClass>` na configuração do `spring-boot-maven-plugin` foram declaradas explicitamente no `pom.xml` para eliminar conflito de classes principais duplicadas detectado durante o empacotamento em nuvem.
- O `SecurityConfig` foi atualizado para mapear publicamente os prefixos `/api/*` além dos caminhos sem prefixo, garantindo compatibilidade com o roteamento do proxy reverso do Render.
- Extensões de arquivos estáticos e caminhos de imagens foram liberados explicitamente no `SecurityFilterChain` para sanar o bloqueio HTTP 403 que afetava as imagens dos produtos em produção.

**Banco de dados — Clever Cloud**

O banco MySQL de produção está hospedado na Clever Cloud. A string de conexão inclui o parâmetro `allowPublicKeyRetrieval=true`, necessário para a descriptografia de senhas no handshake com o servidor remoto. O dialeto explícito do Hibernate foi removido da configuração de produção, pois o Spring Boot 3.x resolve o dialeto automaticamente via auto-configuração.

**Frontend**

As rotas de redirecionamento `login` e `admin` foram corrigidas para utilizar caminhos absolutos com barra inicial (`/admin/login`), garantindo resolução correta pelo servidor estático em produção:

```typescript
{ path: 'login', redirectTo: '/admin/login', pathMatch: 'full' },
{ path: 'admin', redirectTo: '/admin/login', pathMatch: 'full' },
```

<br>

## Fluxo de Pedido

1. O cliente adiciona produtos ao carrinho e inicia o checkout
2. Na tela de pagamento, preenche nome, e-mail e seleciona a forma de pagamento
3. O sistema tenta registrar o cliente via `POST /cliente`; caso o e-mail já exista, busca o ID do cliente existente via `GET /cliente`
4. Com o `cliente_id` resolvido, o pedido é registrado via `POST /pedido` com status `pendente`
5. Independentemente do resultado da persistência, o sistema monta uma mensagem estruturada e redireciona para o WhatsApp da confeitaria via `wa.me`
6. O carrinho é limpo e o usuário é redirecionado para a página inicial

<br>

## Modelos de Dados

| Entidade | Tabela | Descrição |
|---|---|---|
| `AdminUsuario` | `admin_usuario` | Usuários com acesso ao painel administrativo |
| `Categoria` | `categoria` | Categorias de produtos com flag de ativo/inativo |
| `Produto` | `produto` | Produtos do catálogo com preço, estoque, imagem e vínculo com categoria |
| `Cliente` | `cliente` | Dados dos clientes que realizam pedidos |
| `Pedido` | `pedido` | Registro de pedidos com forma de pagamento, valor total e status |
| `ItemPedido` | `item_pedido` | Itens individuais de cada pedido com quantidade e subtotal |

<br>

## Licença

Este projeto é de uso privado. Todos os direitos reservados à Adriana Novais Confeitaria.
