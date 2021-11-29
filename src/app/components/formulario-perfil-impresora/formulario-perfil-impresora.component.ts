import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

import { ConfiguracionService } from '../../services/configuracion.service';

import { PerfilImpresora } from '../../models/configuracion.interface';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-formulario-perfil-impresora',
  templateUrl: './formulario-perfil-impresora.component.html',
  styleUrls: ['./formulario-perfil-impresora.component.css'],
})
export class FormularioPerfilImpresoraComponent implements OnInit {
  @Input() isCreatePerfilImpresora: boolean = false;
  @Input() id_perfil_impresora: number = 0;

  public formulario: FormGroup;
  public isLoading: boolean = false;
  private url = environment.url;

  constructor(
    private fb: FormBuilder,
    private configuracionService: ConfiguracionService
  ) {
    this.formulario = this.fb.group({
      nroFactura: [
        '',
        [Validators.required, Validators.pattern('[0-9]{1,7}$')],
      ],
      factura: ['', [Validators.required]],
      impresora: ['', [Validators.required]],
      coorX: ['', [Validators.required, Validators.pattern('[0-9]{1,7}$')]],
      coorY: ['', [Validators.required, Validators.pattern('[0-9]{1,7}$')]],
    });
  }

  ngOnInit(): void {
    if (!this.isCreatePerfilImpresora) {
      this.cargarFormulario();
    }
  }

  get nroFacturaNoValido(): boolean {
    return (
      (this.formulario.get('nroFactura')?.invalid &&
        this.formulario.get('nroFactura')?.touched) ||
      false
    );
  }
  get facturaNoValido(): boolean {
    return (
      (this.formulario.get('factura')?.invalid &&
        this.formulario.get('factura')?.touched) ||
      false
    );
  }
  get impresoraNoValido(): boolean {
    return (
      (this.formulario.get('impresora')?.invalid &&
        this.formulario.get('impresora')?.touched) ||
      false
    );
  }
  get coorXNoValido(): boolean {
    return (
      (this.formulario.get('coorX')?.invalid &&
        this.formulario.get('coorX')?.touched) ||
      false
    );
  }
  get coorYNoValido(): boolean {
    return (
      (this.formulario.get('coorY')?.invalid &&
        this.formulario.get('coorY')?.touched) ||
      false
    );
  }

  cargarFormulario() {
    this.configuracionService
      .getPerfilImpresora(
        `${this.url}/configuracion/configuracion/${this.id_perfil_impresora}/`
      )
      .subscribe((resp) => {
        this.formulario.reset({
          impresora: resp.nombre_impresora,
          factura: resp.numeracion_fija_factura,
          nroFactura: resp.numero_factura,
          coorX: resp.coordenada_x,
          coorY: resp.coordenada_y,
        });
      });
  }
  enviarFormulario() {
    if (this.formulario.valid) {
      if (this.isCreatePerfilImpresora) {
        this.crearPerfil();
      } else {
        this.modificarPerfil();
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
  crearPerfil() {
    const body: PerfilImpresora = {
      id_impresora: 0,
      nombre_impresora: this.formulario.get('impresora')?.value,
      numeracion_fija_factura: this.formulario.get('factura')?.value,
      numero_factura: this.formulario.get('nroFactura')?.value,
      coordenada_x: this.formulario.get('coorX')?.value,
      coordenada_y: this.formulario.get('coorY')?.value,
    };
    this.configuracionService.crearPerfilImpresora(body).subscribe(
      (resp) => {
        this.limpiarFormulario();
        this.isLoading = false;
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'El perfil de impresora fue agregado exitosamente.',
          showConfirmButton: false,
          timer: 1500,
        });
      },
      (err) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No es posible agregar el perfil de impresora.',
          footer: '',
        });
        console.warn('ERROR!!!', err);
      }
    );
  }
  modificarPerfil() {
    const body: PerfilImpresora = {
      id_impresora: this.id_perfil_impresora,
      nombre_impresora: this.formulario.get('impresora')?.value,
      numeracion_fija_factura: this.formulario.get('factura')?.value,
      numero_factura: this.formulario.get('nroFactura')?.value,
      coordenada_x: this.formulario.get('coorX')?.value,
      coordenada_y: this.formulario.get('coorY')?.value,
    };
    this.configuracionService.actualizarPerfilImpresora(body).subscribe(
      (resp) => {
        this.isLoading = false;
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'El perfil de impresora fue actualizado exitosamente.',
          showConfirmButton: false,
          timer: 1500,
        });
      },
      (err) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No es posible actualizar el perfil de impresora.',
          footer: '',
        });
        console.warn('ERROR!!!', err);
      }
    );
  }
  limpiarFormulario() {
    this.formulario.reset({ nroFactura: '', factura: '', impresora: '' });
  }
}
