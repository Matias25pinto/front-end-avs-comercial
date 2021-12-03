import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

import { VentasService } from '../../../services/ventas.service';

import { environment } from '../../../../environments/environment';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-listar-arqueo-caja',
  templateUrl: './listar-arqueo-caja.component.html',
})
export class ListarArqueoCajaComponent implements OnInit {
  public url = environment.url;
  public arqueosCaja: any[] = [];
  public siguiente: string = '';
  public anterior: string = '';
  public isLoading: boolean = false;
  public isError: boolean = false;
  public urlActual: string = '';

  public isUser = false;

  public formularioBuscar: FormGroup;

  //mostrar factura
  public isVisible = false;

  public formulario: FormGroup;
  public arqueoCierre: any = {};

  constructor(private ventasService: VentasService, private fb: FormBuilder) {
    this.formulario = fb.group({
      montoCierre: [
        '',
        [Validators.required, Validators.pattern('[0-9]{1,13}$')],
      ],
    });

    this.formularioBuscar = this.fb.group({
      arqueoCaja: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.cargarArqueosCaja(`${this.url}/cajas/arqueo-caja/`);
  }
  limpiarFormulario() {
    this.formularioBuscar.reset({ arqueoCaja: '' });
  }

  enviarFormulario() {
    this.isError = false;
    if (this.formularioBuscar.valid) {
      const termino = this.formularioBuscar.get('arqueoCaja')?.value;
      const pagina: string = `${this.url}/cajas/busqueda-arqueo/?search=${termino}`;
      this.buscarArqueoCaja(pagina);
    } else {
      this.cargarArqueosCaja(`${this.url}/cajas/arqueo-caja/`);
    }
  }

  buscarArqueoCaja(pagina: string) {
    this.isLoading = true;
    this.arqueosCaja = [];
    this.siguiente = '';
    this.anterior = '';
    this.ventasService.getArqueosCaja(pagina).subscribe(
      (data) => {
        let user = JSON.parse(localStorage.getItem('user'));
        if (user.rol_usuario == 'ADMINISTRADOR') {
          this.arqueosCaja = data.results;
        } else {
          this.arqueosCaja = data.results.filter(
            (arqueo) => arqueo.id_empleado == user.id
          );
        }
        this.siguiente = data.next != null ? data.next : '';
        this.anterior = data.previous != null ? data.previous.toString() : '';
        this.urlActual = pagina;
        this.isLoading = false;
        if (this.arqueosCaja.length === 0) {
          this.isError = true;
        }
      },
      (err) => {
        this.urlActual = pagina;
        this.isLoading = false;
        this.isError = true;
        console.warn(err);
      }
    );
  }
  cargarArqueosCaja(pagina: string) {
    this.isLoading = true;
    this.arqueosCaja = [];
    this.siguiente = '';
    this.anterior = '';
    this.ventasService.getNotasCredito(pagina).subscribe(
      (data) => {
        let user = JSON.parse(localStorage.getItem('user'));

        if (data.results.length > 0) {
          if (user.rol_usuario == 'ADMINISTRADOR') {
            this.arqueosCaja = data.results;
          } else {
            this.arqueosCaja = data.results.filter(
              (arqueo) => arqueo.id_empleado == user.id
            );
          }
          let arqueoUsuario = this.arqueosCaja.find(
            (arqueo) => arqueo.id_empleado == user.id
          );
          if (arqueoUsuario) {
            this.isUser = true;
          } else {
            this.isUser = false;
          }
          this.siguiente = data.next != null ? data.next : '';
          this.anterior = data.previous != null ? data.previous.toString() : '';
          this.urlActual = pagina;
          this.isLoading = false;
        }
      },
      (err) => {
        this.urlActual = pagina;
        this.isLoading = false;
        this.isError = true;
        console.warn(err);
      }
    );
  }
  showModal(): void {
    this.isVisible = true;
  }
  handleOk(): void {
    if (this.formulario.valid) {
      this.enviarFormularioCierre();
      this.isVisible = false;
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  mostrarModificarArqueo(id: number) {
    this.limpiarFormularioCierre();
    this.arqueoCierre = this.arqueosCaja.find(
      (arqueo) => arqueo.id_arqueo_caja === id
    );
    this.isVisible = true;
  }

  get montoCierreNoValido(): boolean {
    return (
      (this.formulario.get('montoCierre')?.invalid &&
        this.formulario.get('montoCierre')?.touched) ||
      false
    );
  }

  enviarFormularioCierre() {
    if (this.formulario.valid) {
      this.isLoading = true;
      const body = {
        monto_cierre: this.formulario.get('montoCierre')?.value,
        fecha_apertura: this.arqueoCierre.fecha_apertura,
        hora_cierre: '',
        id_arqueo_caja: this.arqueoCierre.id_arqueo_caja,
        id_empleado: this.arqueoCierre.id_empleado,
        monto_apertura: this.arqueoCierre.monto_apertura,
        monto_calculado: this.arqueoCierre.monto_calculado,
        monto_comprobante: this.arqueoCierre.monto_comprobante,
        nombre_usuario: 'Cacjero Front-end',
      };
      this.ventasService.cierreArqueoCaja(body).subscribe(
        (resp) => {
          this.isLoading = false;
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Arqueo de Caja Cerrado exitosamente.',
            showConfirmButton: false,
            timer: 1500,
          });

          this.cargarArqueosCaja(`${this.url}/cajas/arqueo-caja/`);
          this.limpiarFormularioCierre();
        },
        (err) => {
          this.isLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No es posible Cerrar el arqueo de caja.',
            footer: '',
          });
          console.warn('ERROR!!!', err);
        }
      );
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
  limpiarFormularioCierre() {
    this.arqueoCierre = {};
    this.formulario.reset({ montoCierre: '' });
  }
}
