import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SistemaRoutingModule } from './sistema-routing.module';

//Moduls
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

//components

import { HomeComponent } from './home/home.component';
import { SistemaComponent } from './sistema.component';

@NgModule({
  declarations: [HomeComponent, SistemaComponent],
  imports: [
    CommonModule,
    SistemaRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
})
export class SistemaModule {}
