import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Guards
//
//Components
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'sistema',
    loadChildren: () =>
      import('./sistema/sistema.module').then((module) => module.SistemaModule),
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
