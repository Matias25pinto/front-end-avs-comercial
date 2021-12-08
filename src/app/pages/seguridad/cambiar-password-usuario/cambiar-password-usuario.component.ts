import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../models/usuario.interfaces';
import { UsuarioService } from '../../../services/usuario.service';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

import { ValidadoresService } from '../../../services/validadores.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-cambiar-password-usuario',
  templateUrl: './cambiar-password-usuario.component.html',
})
export class CambiarPasswordUsuarioComponent implements OnInit {
  public id_usuario: number;
  public usuario: User;
  public formularioUsuario: FormGroup;
  public isLoading: boolean = false;
  public url: string = environment.url;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private validadores: ValidadoresService
  ) {
    this.route.params.subscribe((params) => (this.id_usuario = params.id));
    this.formularioUsuario = this.fb.group(
      {
        password: ['', [Validators.required]],
        password_confirmation: ['', [Validators.required]],
      },
      {
        //Para validar password de forma ascincrona
        //validadores ascincronos
        validators: this.validadores.passwordsIguales(
          'password',
          'password_confirmation'
        ),
      }
    );
  }

  ngOnInit(): void {
    this.cargarUsuario();
  }
  get passwordNoValido(): boolean {
    return (
      (this.formularioUsuario.get('password')?.invalid &&
        this.formularioUsuario.get('password')?.touched) ||
      false
    );
  }

  get password_confirmationNoValido(): boolean {
    return (
      (this.formularioUsuario.get('password_confirmation')?.invalid &&
        this.formularioUsuario.get('password_confirmation')?.touched) ||
      false
    );
  }
  cargarUsuario() {
    this.usuarioService.getUsuario(this.id_usuario).subscribe((user) => {
      console.log(user);
      this.usuario = user;
    });
  }
  enviarFormulario() {
    if (this.formularioUsuario.valid) {
      this.isLoading = true;
      const id_usuario = this.id_usuario;
      const password = this.formularioUsuario.get('password')?.value;
      const password_confirmation = this.formularioUsuario.get(
        'password_confirmation'
      )?.value;
      const body = { id_usuario, password, password_confirmation };
      this.usuarioService.cambiarPassword(body).subscribe(
        (data) => {
          this.isLoading = false;
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Password Actualizado.',
            showConfirmButton: false,
            timer: 1500,
          });
	  this.limpiarFormulario();
          console.log(data);
        },
        (err) => {
          this.isLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No es posible actualizar el password.',
            footer: '',
          });
          console.warn('ERROR!!!', err);
        }
      );
    } else {
      this.isLoading = false;
      Object.values(this.formularioUsuario.controls).forEach((control) => {
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
    this.formularioUsuario.reset({ password: '', password_confirmation: '' });
  }
}
