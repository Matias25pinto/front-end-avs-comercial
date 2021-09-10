import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-usuarios',
  templateUrl: './listar-usuarios.component.html',
})
export class ListarUsuariosComponent implements OnInit {
  public usuarios: any[] = [
    {
      id: 123,
      username: 'Matias',
      first_name: 'matias',
      last_name: 'Pinto',
      email: 'matias25pinto@gmail.com',
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  modificarUsuario(id: number) {
    this.router.navigate(['seguridad', 'modificar-usuario', id]);
  }

  eliminarUsuario(usuario: string) {
    let titulo = `Eliminar Usuario !!!`;
    let message = `¿Está seguro de eliminar al usuario ${usuario}? `;
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
          swalWithBootstrapButtons.fire(
            'Eliminado!!!',
            'El usuario fue eliminado con éxito!!!',
            'success'
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
