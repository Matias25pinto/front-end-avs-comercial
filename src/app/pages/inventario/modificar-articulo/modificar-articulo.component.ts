import { Component, OnInit } from '@angular/core';
import { Articulo } from 'src/app/models/articulo.interface';

@Component({
  selector: 'app-modificar-articulo',
  templateUrl: './modificar-articulo.component.html',
})
export class ModificarArticuloComponent implements OnInit {
  public crearArticulo = false;

  constructor() {}

  ngOnInit(): void {}
}
