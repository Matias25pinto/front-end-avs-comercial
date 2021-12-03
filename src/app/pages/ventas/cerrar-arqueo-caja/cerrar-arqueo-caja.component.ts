import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VentasService } from '../../../services/ventas.service';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cerrar-arqueo-caja',
  templateUrl: './cerrar-arqueo-caja.component.html',
})
export class CerrarArqueoCajaComponent implements OnInit {
  public isLoading = false;

  public formulario: FormGroup;

  constructor(private fb: FormBuilder, private ventasService: VentasService) {
    this.formulario = fb.group({
      montoCierre: [
        '',
        [Validators.required, Validators.pattern('[0-9]{1,13}$')],
      ],
    });
  }

  ngOnInit(): void {}

  get montoCierreNoValido(): boolean {
    return (
      (this.formulario.get('montoCierre')?.invalid &&
        this.formulario.get('montoCierre')?.touched) ||
      false
    );
  }

  enviarFormulario() {
    if (this.formulario.valid) {
      this.isLoading = true;
      console.log(this.formulario.value);
      const body = {
        monto_cierre: this.formulario.get('montoCierre')?.value,
      };
      this.ventasService.cierreArqueoCaja(body).subscribe(
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
    this.formulario.reset({ montoCierre: '' });
  }
}
