import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-modificar-articulo',
  templateUrl: './modificar-articulo.component.html',
})
export class ModificarArticuloComponent implements OnInit {
  public id_articulo: number = 0;
  constructor(private routes: ActivatedRoute) {
    this.routes.params.subscribe((params) => {
      this.id_articulo = params['id'];
    });
  }

  ngOnInit(): void {}
}
