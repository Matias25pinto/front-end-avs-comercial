import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modificar-usuario',
  templateUrl: './modificar-usuario.component.html',
})
export class ModificarUsuarioComponent implements OnInit {
  public isModified = true;
  public id_user: number = 0;

  constructor(private routes: ActivatedRoute) {
    this.routes.params.subscribe((params) => {
      this.id_user = params['id'];
    });
  }

  ngOnInit(): void {
  }
}
