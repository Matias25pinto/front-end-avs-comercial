import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  public formularioLogin: FormGroup;

  public isLoading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private usuarioServices: UsuarioService,
    private router: Router
  ) {
    this.formularioLogin = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  enviarFormulario() {
    if (this.formularioLogin.valid) {
      this.isLoading = true;
      const email = this.formularioLogin.get('email')?.value;
      const password = this.formularioLogin.get('password')?.value;
      this.usuarioServices.iniciarSesion(email, password).subscribe(
        (data) => {
          localStorage.setItem('access_token', data.access_token);
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Iniciando Sesión',
            showConfirmButton: false,
            timer: 1500,
          });
          this.limpiarFormulario();
          this.router.navigate(['/home']);
          this.isLoading = false;
          // Vuelve a cargar la página actual sin la caché del navegador
          location.reload();
        },
        (err) => {
          console.log(err);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'ERROR!! no es posible iniciar sesión',
            footer: 'verificar el email o el password',
          });
          this.isLoading = false;
        }
      );
    } else {
      console.log('El formulario no es válido');
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'ERROR!! no es posible iniciar sesión',
        footer: 'verificar el email o el password',
      });
    }
  }
  limpiarFormulario() {
    this.formularioLogin.reset({
      email: '',
      password: '',
    });
  }
}
