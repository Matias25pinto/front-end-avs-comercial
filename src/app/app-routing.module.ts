import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Guards
import { LoginGuard } from './guards/login.guard';
//Components
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { CrearArticuloComponent } from './pages/inventario/crear-articulo/crear-articulo.component';
import { ModificarArticuloComponent } from './pages/inventario/modificar-articulo/modificar-articulo.component';
import { VerArticulosComponent } from './pages/inventario/ver-articulos/ver-articulos.component';
import { ModificarStockComponent } from './pages/inventario/modificar-stock/modificar-stock.component';
import { VisualizarRolesComponent } from './pages/seguridad/visualizar-roles/visualizar-roles.component';
import { CrearRolComponent } from './pages/seguridad/crear-rol/crear-rol.component';
import { ModificarRolComponent } from './pages/seguridad/modificar-rol/modificar-rol.component';
import { ListarUsuariosComponent } from './pages/seguridad/listar-usuarios/listar-usuarios.component';
import { CrearUsuarioComponent } from './pages/seguridad/crear-usuario/crear-usuario.component';
import { ModificarUsuarioComponent } from './pages/seguridad/modificar-usuario/modificar-usuario.component';
import { ListarClientesComponent } from './pages/ventas/listar-clientes/listar-clientes.component';
import { CrearClienteComponent } from './pages/ventas/crear-cliente/crear-cliente.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [LoginGuard] },
  {
    path: 'inventario/crear-articulo',
    component: CrearArticuloComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'inventario/modificar-articulo/:id',
    component: ModificarArticuloComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'inventario/ver-articulos',
    component: VerArticulosComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'inventario/modificar-stock/:id',
    component: ModificarStockComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'seguridad/listar-roles',
    component: VisualizarRolesComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'seguridad/crear-rol',
    component: CrearRolComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'seguridad/modificar-rol/:id',
    component: ModificarRolComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'seguridad/listar-usuarios',
    component: ListarUsuariosComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'seguridad/crear-usuario',
    component: CrearUsuarioComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'seguridad/modificar-usuario/:id',
    component: ModificarUsuarioComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'ventas/listar-clientes',
    component: ListarClientesComponent,
    canActivate: [LoginGuard],
  },
  {path:'ventas/agregar-cliente', component: CrearClienteComponent, canActivate: [LoginGuard]},
  { path: '*', pathMatch: 'full', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
