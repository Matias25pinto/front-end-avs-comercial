import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../models/usuario.interfaces';
import { UsuarioService } from '../../services/usuario.service';
import { ConfiguracionService } from '../../services/configuracion.service';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

import { ValidadoresService } from '../../services/validadores.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-formulario-usuario',
  templateUrl: './formulario-usuario.component.html',
})
export class FormularioUsuarioComponent implements OnInit {
  @Input() isCreateUser;

  @Input() id_user;
  public formularioUsuario: FormGroup;

  public isLoading: boolean = false;

  public impresoras: any[] = [];
  public url: string = environment.url;
  public selectdValue = 0;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private validadores: ValidadoresService,
    private configuracionService: ConfiguracionService
  ) {}

  ngOnInit(): void {
    if (this.isCreateUser) {
      this.formularioUsuario = this.fb.group(
        {
          username: [
            '',
            [Validators.required, Validators.pattern('^[a-zA-Z0-9_]*$')],
          ],
          first_name: ['', [Validators.required]],
          last_name: ['', [Validators.required]],
          email: [
            '',
            [
              Validators.required,
              Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
            ],
          ],
          role: ['', [Validators.required]],
          impresora: [''],
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
          validators2: this.validadores.impresoraValida('impresora', 'role'),
        }
      );
    } else {
      this.formularioUsuario = this.fb.group({
        username: ['', [Validators.required]],
        first_name: ['', [Validators.required]],
        last_name: ['', [Validators.required]],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
          ],
        ],
        role: ['', [Validators.required]],
        impresora: [''],
      });
    }

    this.configuracionService
      .listaImpresoras(`${this.url}/configuracion/configuracion-lista/`)
      .subscribe((resp) => {
        this.impresoras = resp;
      });
    if (!this.isCreateUser) {
      this.cargarFormulario();
    }
  }

  get usernameNoValido(): boolean {
    return (
      (this.formularioUsuario.get('username')?.invalid &&
        this.formularioUsuario.get('username')?.touched) ||
      false
    );
  }
  get first_nameNoValido(): boolean {
    return (
      (this.formularioUsuario.get('first_name')?.invalid &&
        this.formularioUsuario.get('first_name')?.touched) ||
      false
    );
  }
  get last_nameNoValido(): boolean {
    return (
      (this.formularioUsuario.get('last_name')?.invalid &&
        this.formularioUsuario.get('last_name')?.touched) ||
      false
    );
  }
  get emailNoValido(): boolean {
    return (
      (this.formularioUsuario.get('email')?.invalid &&
        this.formularioUsuario.get('email')?.touched) ||
      false
    );
  }
  get roleNoValido(): boolean {
    return (
      (this.formularioUsuario.get('role')?.invalid &&
        this.formularioUsuario.get('role')?.touched) ||
      false
    );
  }
  get impresoraNoValido(): boolean {
    return (
      (this.formularioUsuario.get('impresora')?.invalid &&
        this.formularioUsuario.get('impresora')?.touched) ||
      false
    );
  }

  get passwordNoValido(): boolean {
    if (this.isCreateUser) {
      return (
        (this.formularioUsuario.get('password')?.invalid &&
          this.formularioUsuario.get('password')?.touched) ||
        false
      );
    }
    return false;
  }

  get password_confirmationNoValido(): boolean {
    if (this.isCreateUser) {
      return (
        (this.formularioUsuario.get('password_confirmation')?.invalid &&
          this.formularioUsuario.get('password_confirmation')?.touched) ||
        false
      );
    }
    return false;
  }

  cargarFormulario() {
    this.usuarioService.getUsuario(this.id_user).subscribe((user) => {
      const impresora = this.impresoras.find(
        (impresora) => impresora.id_impresora == user.configuracion
      );
      let formulario = {
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.rol_usuario,
      };
      if(impresora){
	formulario["impresora"]=impresora.id_impresora;
      }
      console.log("FORMULARIO:", formulario);
      this.formularioUsuario.reset(formulario);
    });
  }

  enviarFormulario() {
    if (this.formularioUsuario.valid) {
      this.isLoading = true;
      let username = this.formularioUsuario.get('username')?.value;
      let first_name = this.formularioUsuario.get('first_name')?.value;
      let last_name = this.formularioUsuario.get('last_name')?.value;
      let email = this.formularioUsuario.get('email')?.value;
      let rol_usuario = this.formularioUsuario.get('role')?.value;
      if (this.isCreateUser) {
        let password = this.formularioUsuario.get('password')?.value;
        let password_confirmation = this.formularioUsuario.get(
          'password_confirmation'
        )?.value;

        let body: User = {
          username,
          first_name,
          last_name,
          email,
          password,
          password_confirmation,
          rol_usuario,
        };
        if (this.formularioUsuario.get('impresora')?.value != '') {
          let configuracion = this.formularioUsuario.get('impresora')?.value;
          body['configuracion'] = configuracion;
        }

        this.crearUsuario(body);
      } else {
        let body: User = {
          username,
          first_name,
          last_name,
          email,
          rol_usuario,
        };
        if (this.formularioUsuario.get('impresora')?.value != '') {
          let configuracion = this.formularioUsuario.get('impresora')?.value;
          body['configuracion'] = configuracion;
        }

        this.modificarUsuario(body);
      }
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
  crearUsuario(body: User) {
    this.usuarioService.crearUsuario(body).subscribe(
      (user) => {
        console.log(user);
        this.limpiarFormulario();
        this.isLoading = false;
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Usuario creado exitosamente.',
          showConfirmButton: false,
          timer: 1500,
        });
      },
      (err) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No es posible crear el usuario.',
          footer: '',
        });
        console.warn('ERROR!!!', err);
      }
    );
  }
  modificarUsuario(body: User) {
    this.usuarioService.modificarUsuario(this.id_user, body).subscribe(
      (user) => {
        console.log(user);
        this.isLoading = false;
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Usuario Modificado.',
          showConfirmButton: false,
          timer: 1500,
        });
      },
      (err) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No es posible modificar el usuario.',
          footer: '',
        });
        console.warn('ERROR!!!', err);
      }
    );
  }
  limpiarFormulario() {
    this.formularioUsuario.reset({
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password_confirmation: '',
      role: '',
      impresora: '',
    });
  }
}
