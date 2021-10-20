import { Component, OnInit } from '@angular/core';
import { Proveedor } from '../../../models/proveedor.interface';
import { ProveedoresService } from '../../../services/proveedores.service';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editar-proveedor',
  templateUrl: './editar-proveedor.component.html',
})
export class EditarProveedorComponent implements OnInit {
  public proveedor: Proveedor = {
    id_proveedor:0,
    tipo_persona: 'F',
    propietario: 'perrito calvo',
    direccion: '',
    telefono: '',
    ruc: '',
    correo_electronico: '',
    fecha_nacimiento: '',
    estado_activo: 'V',
  };
  private url = environment.url;
  public id_proveedor = 0;

  constructor(
    private proveedoresService: ProveedoresService,
    private route: ActivatedRoute
  ) {
    this.cargarPersona();
  }

  ngOnInit(): void {}
  async cargarPersona() {
    this.route.params.subscribe((param) => {
      this.id_proveedor = param.id;
    });
  }
}
