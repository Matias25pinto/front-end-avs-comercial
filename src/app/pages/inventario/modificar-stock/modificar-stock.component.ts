import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-modificar-stock',
  templateUrl: './modificar-stock.component.html',
})
export class ModificarStockComponent implements OnInit {
  public formularioModificarStock: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formularioModificarStock = this.fb.group({
      motivo: [''],
      tipo: [''],
      ajuste: [''],
    });
  }

  ngOnInit(): void {}
}
