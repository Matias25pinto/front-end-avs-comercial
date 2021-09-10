import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modificar-rol',
  templateUrl: './modificar-rol.component.html',
})
export class ModificarRolComponent implements OnInit {

  public rol: any = {
    rol: 'Rol 1',
    descripcion: 'Es la descripcion del rol 1',
    seguridad: true,
    inventario: true,
  };

  public isModified = true;

  constructor() {}

  ngOnInit(): void {
    console.log(this.rol, this.isModified);
  }
}
