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
import { ModificarClienteComponent } from './pages/ventas/modificar-cliente/modificar-cliente.component';
import { ListarProveedoresComponent } from './pages/compras/listar-proveedores/listar-proveedores.component';
import { CrearProveedorComponent } from './pages/compras/crear-proveedor/crear-proveedor.component';
import { EditarProveedorComponent } from './pages/compras/editar-proveedor/editar-proveedor.component';
import { CrearVentaComponent } from './pages/ventas/crear-venta/crear-venta.component';
import { ListarVentasComponent } from './pages/ventas/listar-ventas/listar-ventas.component';
import { ListarComprasComponent } from './pages/compras/listar-compras/listar-compras.component';
import { CrearPerfilImpresoraComponent } from './pages/configuracion/crear-perfil-impresora/crear-perfil-impresora.component';
import { ListarPerfilesImpresoraComponent } from './pages/configuracion/listar-perfiles-impresora/listar-perfiles-impresora.component';
import { ModificarPerfilImpresoraComponent } from './pages/configuracion/modificar-perfil-impresora/modificar-perfil-impresora.component';

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
    path: 'inventario/ver-articulos',
    component: VerArticulosComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'inventario/modificar-articulo/:id',
    component: ModificarArticuloComponent,
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
  {
    path: 'ventas/modificar-cliente/:id',
    component: ModificarClienteComponent,
    canActivate: [LoginGuard],
  },

  {
    path: 'ventas/agregar-cliente',
    component: CrearClienteComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'ventas/listar-ventas',
    component: ListarVentasComponent,
    canActivate: [LoginGuard],
  },

  {
    path: 'ventas/crear-venta',
    component: CrearVentaComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'compras/listar-proveedores',
    component: ListarProveedoresComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'compras/crear-proveedor',
    component: CrearProveedorComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'compras/editar-proveedor/:id',
    component: EditarProveedorComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'compras/listar-compras',
    component: ListarComprasComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'configuracion/crear-perfil-impresora',
    component: CrearPerfilImpresoraComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'configuracion/listar-perfiles-impresora',
    component: ListarPerfilesImpresoraComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'configuracion/modificar-perfil-impresora/:id',
    component: ModificarPerfilImpresoraComponent,
    canActivate: [LoginGuard],
  },
  { path: '*', pathMatch: 'full', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
