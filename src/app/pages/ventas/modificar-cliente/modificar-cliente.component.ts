import { Component, OnInit } from '@angular/core';
import { Persona } from '../../../models/persona.interface';
import { PersonaService } from '../../../services/persona.service';
import { environment } from '../../../../environments/environment';
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
  private url = environment.url;
  public id_persona = 0;

  constructor(
    private personaService: PersonaService,
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
