import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Router } from '@angular/router';
import { VentasService } from '../../../services/ventas.service';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-arqueo-caja',
  templateUrl: './crear-arqueo-caja.component.html',
})
export class CrearArqueoCajaComponent implements OnInit {
  public isLoading = false;

  public formulario: FormGroup;

  constructor(private fb: FormBuilder, private ventasService: VentasService, private router:Router) {
    this.formulario = fb.group({
      montoApertura: [
        '',
        [Validators.required, Validators.pattern('[0-9]{1,13}$')],
      ],
    });
  }

  ngOnInit(): void {}

  get montoAperturaNoValido(): boolean {
    return (
      (this.formulario.get('montoApertura')?.invalid &&
        this.formulario.get('montoApertura')?.touched) ||
      false
    );
  }

  enviarFormulario() {
    if (this.formulario.valid) {
      this.isLoading = true;
      console.log(this.formulario.value);
      const body = {
        monto_apertura: this.formulario.get('montoApertura')?.value,
      };
      this.ventasService.aperturaArqueoCaja(body).subscribe(
        (resp) => {
          console.log(resp);
          this.isLoading = false;
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Arqueo de Caja creado exitosamente.',
            showConfirmButton: false,
            timer: 1500,
          });

          this.limpiarFormulario();
        },
        (err) => {
          this.isLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No es posible agregar el arqueo de caja.',
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
  limpiarFormulario() {
    this.router.navigate(['arqueo-caja','listar-arqueo-caja']);
    this.formulario.reset({ montoApertura: '' });
  }
}
