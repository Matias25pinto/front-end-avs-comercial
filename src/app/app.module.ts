import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//Moduls
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

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
import { CrearRolComponent } from './pages/seguridad/crear-rol/crear-rol.component';
import { ModificarRolComponent } from './pages/seguridad/modificar-rol/modificar-rol.component';
import { VisualizarRolesComponent } from './pages/seguridad/visualizar-roles/visualizar-roles.component';
import { FormularioRolComponent } from './components/formulario-rol/formulario-rol.component';
import { CrearUsuarioComponent } from './pages/seguridad/crear-usuario/crear-usuario.component';
import { ModificarUsuarioComponent } from './pages/seguridad/modificar-usuario/modificar-usuario.component';
import { ListarUsuariosComponent } from './pages/seguridad/listar-usuarios/listar-usuarios.component';
import { FormularioUsuarioComponent } from './components/formulario-usuario/formulario-usuario.component';
import { ListarClientesComponent } from './pages/ventas/listar-clientes/listar-clientes.component';
import { CrearClienteComponent } from './pages/ventas/crear-cliente/crear-cliente.component';
import { FormularioPersonaComponent } from './components/formulario-persona/formulario-persona.component';


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
    CrearRolComponent,
    ModificarRolComponent,
    VisualizarRolesComponent,
    FormularioRolComponent,
    CrearUsuarioComponent,
    ModificarUsuarioComponent,
    ListarUsuariosComponent,
    FormularioUsuarioComponent,
    ListarClientesComponent,
    CrearClienteComponent,
    FormularioPersonaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
