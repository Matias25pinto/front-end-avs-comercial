import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//Moduls
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

//Pipes
import { SafePipe } from './pipes/safe.pipe';

//La localidad de la app
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localEs from '@angular/common/locales/es';
registerLocaleData(localEs);

//Angular Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field'; //Para utilizar formularios de Angular Material
import { MAT_DATE_LOCALE } from '@angular/material/core';

//NG-Zorro
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzModalModule } from 'ng-zorro-antd/modal';

//Components
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { AsideComponent } from './components/aside/aside.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { CrearArticuloComponent } from './pages/inventario/crear-articulo/crear-articulo.component';
import { VerArticulosComponent } from './pages/inventario/ver-articulos/ver-articulos.component';
import { ModificarArticuloComponent } from './pages/inventario/modificar-articulo/modificar-articulo.component';
import { FormularioArticuloComponent } from './components/formulario-articulo/formulario-articulo.component';
import { ModificarStockComponent } from './pages/inventario/modificar-stock/modificar-stock.component';
import { CrearUsuarioComponent } from './pages/seguridad/crear-usuario/crear-usuario.component';
import { ModificarUsuarioComponent } from './pages/seguridad/modificar-usuario/modificar-usuario.component';
import { ListarUsuariosComponent } from './pages/seguridad/listar-usuarios/listar-usuarios.component';
import { FormularioUsuarioComponent } from './components/formulario-usuario/formulario-usuario.component';
import { ListarClientesComponent } from './pages/ventas/listar-clientes/listar-clientes.component';
import { CrearClienteComponent } from './pages/ventas/crear-cliente/crear-cliente.component';
import { FormularioPersonaComponent } from './components/formulario-persona/formulario-persona.component';
import { ModificarClienteComponent } from './pages/ventas/modificar-cliente/modificar-cliente.component';
import { ListarProveedoresComponent } from './pages/compras/listar-proveedores/listar-proveedores.component';
import { CrearProveedorComponent } from './pages/compras/crear-proveedor/crear-proveedor.component';
import { EditarProveedorComponent } from './pages/compras/editar-proveedor/editar-proveedor.component';
import { FormularioProveedorComponent } from './components/formulario-proveedor/formulario-proveedor.component';
import { CrearVentaComponent } from './pages/ventas/crear-venta/crear-venta.component';
import { ListarVentasComponent } from './pages/ventas/listar-ventas/listar-ventas.component';
import { CrearCompraComponent } from './pages/compras/crear-compra/crear-compra.component';
import { ListarComprasComponent } from './pages/compras/listar-compras/listar-compras.component';
import { ListarPerfilesImpresoraComponent } from './pages/configuracion/listar-perfiles-impresora/listar-perfiles-impresora.component';
import { CrearPerfilImpresoraComponent } from './pages/configuracion/crear-perfil-impresora/crear-perfil-impresora.component';
import { ModificarPerfilImpresoraComponent } from './pages/configuracion/modificar-perfil-impresora/modificar-perfil-impresora.component';
import { FormularioPerfilImpresoraComponent } from './components/formulario-perfil-impresora/formulario-perfil-impresora.component';
import { CrearNotaCreditoComponent } from './pages/ventas/crear-nota-credito/crear-nota-credito.component';
import { ListarNotasCreditoComponent } from './pages/ventas/listar-notas-credito/listar-notas-credito.component';
import { CrearArqueoCajaComponent } from './pages/ventas/crear-arqueo-caja/crear-arqueo-caja.component';
import { ListarArqueoCajaComponent } from './pages/ventas/listar-arqueo-caja/listar-arqueo-caja.component';
import { CerrarArqueoCajaComponent } from './pages/ventas/cerrar-arqueo-caja/cerrar-arqueo-caja.component';
import { FormularioComprasComponent } from './components/formulario-compras/formulario-compras.component';
import { CrearNotaCreditoProveedorComponent } from './pages/compras/crear-nota-credito-proveedor/crear-nota-credito-proveedor.component';
import { ListarNotasCreditoProveedorComponent } from './pages/compras/listar-notas-credito-proveedor/listar-notas-credito-proveedor.component';

@NgModule({
  declarations: [
    AppComponent,
    AsideComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    HomeComponent,
    CrearArticuloComponent,
    VerArticulosComponent,
    ModificarArticuloComponent,
    FormularioArticuloComponent,
    ModificarStockComponent,
    CrearUsuarioComponent,
    ModificarUsuarioComponent,
    ListarUsuariosComponent,
    FormularioUsuarioComponent,
    ListarClientesComponent,
    CrearClienteComponent,
    FormularioPersonaComponent,
    ModificarClienteComponent,
    ListarProveedoresComponent,
    CrearProveedorComponent,
    EditarProveedorComponent,
    FormularioProveedorComponent,
    CrearVentaComponent,
    ListarVentasComponent,
    SafePipe,
    CrearCompraComponent,
    ListarComprasComponent,
    ListarPerfilesImpresoraComponent,
    CrearPerfilImpresoraComponent,
    ModificarPerfilImpresoraComponent,
    FormularioPerfilImpresoraComponent,
    CrearNotaCreditoComponent,
    ListarNotasCreditoComponent,
    CrearArqueoCajaComponent,
    ListarArqueoCajaComponent,
    CerrarArqueoCajaComponent,
    FormularioComprasComponent,
    CrearNotaCreditoProveedorComponent,
    ListarNotasCreditoProveedorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    NzSelectModule,
    NzDividerModule,
    NzModalModule,
  ],

  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    { provide: MAT_DATE_LOCALE, useValue: 'es-PY' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
