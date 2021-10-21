import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

import { UsuarioService } from '../../../services/usuario.service';
import { User } from '../../../models/usuario.interfaces';

import { environment } from '../../../../environments/environment';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-listar-usuarios',
  templateUrl: './listar-usuarios.component.html',
})
export class ListarUsuariosComponent implements OnInit {
  public url = environment.url;
  public usuarios: User[] = [];
  public siguiente: string = '';
  public anterior: string = '';
  public isLoading: boolean = false;
  public isError: boolean = false;
  public urlActual: string = '';

  public formularioBuscar: FormGroup;

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private fb: FormBuilder
  ) {
    this.formularioBuscar = this.fb.group({
      usuario: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.cargarUsuarios(`${this.url}/users/`);
  }
  limpiarFormulario() {
    this.formularioBuscar.reset({ usuario: '' });
  }

  enviarFormulario() {
    this.isError = false;
    if (this.formularioBuscar.valid) {
      const termino = this.formularioBuscar.get('usuario')?.value;
      const pagina: string = `${this.url}/users/busqueda/?search=${termino}`;
      this.buscarUsuarios(pagina);
    } else {
      this.cargarUsuarios(`${this.url}/users/`);
    }
  }

  buscarUsuarios(pagina: string) {
    this.isLoading = true;
    this.usuarios = [];
    this.siguiente = '';
    this.anterior = '';
    this.usuarioService.buscarUsuario(pagina).subscribe(
      (data) => {
        this.usuarios = data.results;
        this.siguiente = data.next != null ? data.next : '';
        this.anterior = data.previous != null ? data.previous.toString() : '';
        this.urlActual = pagina;
        this.isLoading = false;
        if (this.usuarios.length === 0) {
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

  cargarUsuarios(pagina: string) {
    this.isLoading = true;
    this.usuarios = [];
    this.siguiente = '';
    this.anterior = '';
    this.usuarioService.getUsuarios(pagina).subscribe(
      (data) => {
        this.usuarios = data.results;
        this.siguiente = data.next != null ? data.next : '';
        this.anterior = data.previous != null ? data.previous.toString() : '';
        this.urlActual = pagina;
        this.isLoading = false;
      },
      (err) => {
        this.urlActual = pagina;
        this.isLoading = false;
        this.isError = true;
        console.warn(err);
      }
    );
  }

  modificarUsuario(id: number = 0) {
    this.router.navigate(['seguridad', 'modificar-usuario', id]);
  }

  eliminarUsuario(usuario: string, id: number = 0) {
    let titulo = `Eliminar Usuario !!!`;
    let message = `¿Está seguro de eliminar el usuario ${usuario}? `;
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: titulo,
        text: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, para eliminar el usuario!',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.usuarioService
            .deleteUsuario(`${this.url}/users/${id}/`)
            .subscribe(
              (resp: any) => {
                if (this.urlActual != `${this.url}/users/`) {
                  if (this.usuarios.length > 1) {
                    this.cargarUsuarios(`${this.urlActual}`);
                  } else {
                    this.cargarUsuarios(`${this.anterior}`);
                  }
                } else {
                  this.cargarUsuarios(`${this.url}/users/`);
                }
                swalWithBootstrapButtons.fire(
                  'Eliminado!!!',
                  'El usuario fue eliminado con éxito!!!',
                  'success'
                );
              },
              (err: any) => {
                swalWithBootstrapButtons.fire(
                  'ERROR!!!',
                  'El usuario no fue eliminado.',
                  'error'
                );
              }
            );
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelado!!!',
            'El usuario no fue eliminado.',
            'error'
          );
        }
      });
  }
}
