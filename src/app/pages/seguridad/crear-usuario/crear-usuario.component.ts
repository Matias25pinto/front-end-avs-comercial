import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
})
export class CrearUsuarioComponent implements OnInit {
  public usuario = {};
  public isModified = false;

  constructor() {}

  ngOnInit(): void {}
}
