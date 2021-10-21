import { Component, OnInit } from '@angular/core';
import { Articulo } from 'src/app/models/articulo.interface';

@Component({
  selector: 'app-crear-articulo',
  templateUrl: './crear-articulo.component.html',
})
export class CrearArticuloComponent implements OnInit {

    public crearArticulo = true;

  constructor() { }

  ngOnInit(): void {
  }

}
