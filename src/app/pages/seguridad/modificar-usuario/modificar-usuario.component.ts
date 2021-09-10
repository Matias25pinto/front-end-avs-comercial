import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modificar-usuario',
  templateUrl: './modificar-usuario.component.html',
})
export class ModificarUsuarioComponent implements OnInit {
  public usuario = {
    id: 123,
    username: 'Matias',
    first_name: 'matias',
    last_name: 'Pinto',
    email: 'matias25pinto@gmail.com',
    rol: 'rol2',
  };
  public isModified = true;

  constructor() {}

  ngOnInit(): void {}
}
