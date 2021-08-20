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
  { path: '*', pathMatch: 'full', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
