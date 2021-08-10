import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Components
import { HomeComponent } from './home/home.component';
import { SistemaComponent } from './sistema.component';

//Guards
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  {
    path: '',
    component: SistemaComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      { path: 'home', component: HomeComponent, canActivate: [LoginGuard] },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SistemaRoutingModule {}
