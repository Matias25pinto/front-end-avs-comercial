import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modificar-perfil-impresora',
  templateUrl: './modificar-perfil-impresora.component.html',
  styleUrls: ['./modificar-perfil-impresora.component.css'],
})
export class ModificarPerfilImpresoraComponent implements OnInit {
  public id_perfil_impresora: number = 0;
  constructor(private routes: ActivatedRoute) {
    this.routes.params.subscribe((params) => {
      this.id_perfil_impresora = params['id'];
    });
  }

  ngOnInit(): void {}
}
