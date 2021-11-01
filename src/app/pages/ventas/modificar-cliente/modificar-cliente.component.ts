import { Component, OnInit } from '@angular/core';
import { Persona } from '../../../models/persona.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modificar-cliente',
  templateUrl: './modificar-cliente.component.html',
})
export class ModificarClienteComponent implements OnInit {
  public person: Persona = {
    id_persona: 0,
    tipo_persona: 'F',
    nombre_apellido: 'perrito calvo',
    propietario: 'N',
    direccion: '',
    telefono: '',
    ruc: '',
    cedula: '',
    correo_electronico: '',
    es_cliente: 'V',
    es_proveedor: 'F',
    fecha_nacimiento: '',
    estado_activo: 'V',
  };
  public id_persona = 0;

  constructor(
    private route: ActivatedRoute
  ) {
    this.cargarPersona();
  }

  ngOnInit(): void {}

  async cargarPersona() {
    this.route.params.subscribe((param) => {
      this.id_persona = param.id;
    });
  }
}
