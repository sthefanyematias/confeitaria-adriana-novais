
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { Home } from './pages/home/home';
import { Produtos } from './pages/produtos/produtos';
import { ProdutoDetalhe } from './pages/produto-detalhe/produto-detalhe';
import { Carrinho } from './pages/carrinho/carrinho';
import { Pagamento } from './pages/pagamento/pagamento';
import { Sobre } from './pages/sobre/sobre';
import { Login } from './pages/admin/login/login';
import { HomeAdmin } from './pages/admin/home/home';
import { ListarProdutos } from './pages/admin/produtos/listar/listar';
import { CadastrarProduto } from './pages/admin/produtos/cadastrar/cadastrar';
import { EditarProduto } from './pages/admin/produtos/editar/editar';
import { Pedidos } from './pages/admin/pedidos/pedidos';
import { ListarCategorias } from './pages/admin/categorias/listar/listar';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Home, title: 'Confeitaria Adriana Novais' },
    { path: 'produtos', component: Produtos, title: 'Confeitaria – Produtos' },
    { path: 'produto/:id', component: ProdutoDetalhe, title: 'Confeitaria – Detalhes' },
    { path: 'carrinho', component: Carrinho, title: 'Confeitaria – Carrinho' },
    { path: 'pagamento', component: Pagamento, title: 'Confeitaria – Pagamento' },
    { path: 'sobre', component: Sobre, title: 'Confeitaria – Conheça Adriana' },
    { path: 'admin/login', component: Login, title: 'Admin – Login' },
    { path: 'admin/home', component: HomeAdmin, canActivate: [authGuard], title: 'Admin – Painel' },
    { path: 'admin/produtos', component: ListarProdutos, canActivate: [authGuard], title: 'Admin – Produtos' },
    { path: 'admin/produtos/cadastrar', component: CadastrarProduto, canActivate: [authGuard], title: 'Admin – Cadastrar Produto' },
    { path: 'admin/produtos/editar/:id', component: EditarProduto, canActivate: [authGuard], title: 'Admin – Editar Produto' },
    { path: 'admin/pedidos', component: Pedidos, canActivate: [authGuard], title: 'Admin – Pedidos' },
    { path: 'admin/categorias', component: ListarCategorias, canActivate: [authGuard], title: 'Admin – Categorias' },
    { path: 'login', redirectTo: 'admin/login', pathMatch: 'full' },   
    { path: 'admin', redirectTo: 'admin/login', pathMatch: 'full' },   
    { path: '**', redirectTo: 'home' }
];
