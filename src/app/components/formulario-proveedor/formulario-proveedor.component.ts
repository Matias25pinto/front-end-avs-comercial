import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

import { ProveedoresService } from '../../services/proveedores.service';

import { Proveedor } from '../../models/proveedor.interface';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-formulario-proveedor',
  templateUrl: './formulario-proveedor.component.html',
})
export class FormularioProveedorComponent implements OnInit {
  @Input() isCreateProveedor: boolean = false;
  @Input() id_proveedor: number = 0;

  public formulario: FormGroup;
  public isLoading: boolean = false;
  private url = environment.url;

  private estado_activo = 'V';

  constructor(
    private fb: FormBuilder,
    private proveedoresService: ProveedoresService
  ) {
    this.formulario = this.fb.group({
      tipo_persona: ['F', Validators.required],
      propietario: ['', [Validators.required, Validators.minLength(5)]],
      direccion: ['', [Validators.required, Validators.minLength(5)]],
      telefono: ['', [Validators.required, Validators.minLength(7)]],
      ruc: ['', [Validators.required, Validators.minLength(8)]],
      correo_electronico: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
      fecha_nacimiento: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (!this.isCreateProveedor) {
      this.cargarFormulario();
    }
  }

  get propietarioNoValido(): boolean {
    return (
      (this.formulario.get('propietario')?.invalid &&
        this.formulario.get('propietario')?.touched) ||
      false
    );
  }
  get tipo_personaNoValido(): boolean {
    return (
      (this.formulario.get('tipo_persona')?.invalid &&
        this.formulario.get('tipo_persona')?.touched) ||
      false
    );
  }
  get direccionNoValido(): boolean {
    return (
      (this.formulario.get('direccion')?.invalid &&
        this.formulario.get('direccion')?.touched) ||
      false
    );
  }
  get telefonoNoValido(): boolean {
    return (
      (this.formulario.get('telefono')?.invalid &&
        this.formulario.get('telefono')?.touched) ||
      false
    );
  }
  get rucNoValido(): boolean {
    return (
      (this.formulario.get('ruc')?.invalid &&
        this.formulario.get('ruc')?.touched) ||
      false
    );
  }
  get correoNoValido(): boolean {
    return (
      (this.formulario.get('correo')?.invalid &&
        this.formulario.get('correo')?.touched) ||
      false
    );
  }
  get fecha_nacimientoNoValido(): boolean {
    return (
      (this.formulario.get('fecha_nacimiento')?.invalid &&
        this.formulario.get('fecha_nacimiento')?.touched) ||
      false
    );
  }

  cargarFormulario() {
    this.proveedoresService
      .getProveedor(`${this.url}/proveedores/${this.id_proveedor}/`)
      .subscribe((resp) => {
        let fechaArray = resp.fecha_nacimiento.split('-');
        let fecha_nacimiento = new Date(
          parseInt(fechaArray[0]),
          parseInt(fechaArray[1]) - 1,
          parseInt(fechaArray[2])
        );
        this.formulario.reset({
          tipo_persona: resp.tipo_persona,
          propietario: resp.propietario,
          direccion: resp.direccion,
          telefono: resp.telefono,
          ruc: resp.ruc,
          correo_electronico:resp.correo_electronico,
          fecha_nacimiento
        });
	this.estado_activo = resp.estado_activo;
      });
  }

  enviarFormulario() {
    if (this.formulario.valid) {
      this.isLoading = true;
      let fecha = this.formulario.get('fecha_nacimiento')?.value;
      const fecha_nacimiento = `${fecha.getFullYear()}-${
        fecha.getMonth() + 1
      }-${fecha.getDate()}`;

      let body: Proveedor = {
        id_proveedor: this.id_proveedor,
        tipo_persona: this.formulario.get('tipo_persona')?.value,
        propietario: this.formulario.get('propietario')?.value,
        direccion: this.formulario.get('direccion')?.value,
        telefono: this.formulario.get('telefono')?.value,
        ruc: this.formulario.get('ruc')?.value,
        correo_electronico: this.formulario.get('correo_electronico')?.value,
        fecha_nacimiento,
        estado_activo: this.estado_activo,
      };
      if (this.isCreateProveedor) {
        this.crearProveedor(body);
      } else {
        this.modificarProveedor(body);
      }
    } else {
      Object.values(this.formulario.controls).forEach((control) => {
        //control instanceof FormGroup; Si es true es porque control es una instancia de FormGroup por lo tanto es otro formGroup para recorrer
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach((control) =>
            control.markAllAsTouched()
          ); //de esta forma markAllAsTouched(); esta marcando como editados a todos los inputs, Touched:que se toco
        } else {
          control.markAsTouched();
        }
      });
    }
  }
  crearProveedor(body: Proveedor) {
    this.proveedoresService.crearProveedor(body).subscribe(
      (data) => {
        this.limpiarFormulario();
        this.isLoading = false;
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Proveedor agregado exitosamente.',
          showConfirmButton: false,
          timer: 1500,
        });
      },
      (err) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No es posible agregar al proveedor.',
          footer: '',
        });
        console.warn('ERROR!!!', err);
      }
    );
  }
  modificarProveedor(body: Proveedor) {
this.proveedoresService.actualizarProveedor(body).subscribe(
      (data) => {
        this.isLoading = false;
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Proveedor actualizado.',
          showConfirmButton: false,
          timer: 1500,
        });
      },
      (err) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No es posible actualizar los datos del proveedor.',
          footer: '',
        });
        console.warn('ERROR!!!', err);
      }
    );

  }
  limpiarFormulario() {
    this.formulario.reset({
      tipo_persona: 'F',
      propietario: '',
      direccion: '',
      telefono: '',
      ruc: '',
      correo_electronico: '',
      fecha_nacimiento: '',
    });
  }
}
