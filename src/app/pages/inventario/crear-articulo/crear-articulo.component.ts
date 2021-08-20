import { Component, OnInit } from '@angular/core';
import { Articulo } from 'src/app/models/articulo.interface';

@Component({
  selector: 'app-crear-articulo',
  templateUrl: './crear-articulo.component.html',
})
export class CrearArticuloComponent implements OnInit {

  public articulo:Articulo = {
    codigo:123,
    nombre:'Articulo 1',
    costo:20000,
    porc_iva:10,
    porc_comision:5,
    stock_actual:100,
    stock_minimo:10,
    ultima_compra:'19/08/2021',
    unidad_medida:'unidad',
    precio_unitario:5000,
    precio_mayorista:4000,
    precio_especial:3500
  }
  public crearArticulo = true;

  constructor() { }

  ngOnInit(): void {
  }

}
