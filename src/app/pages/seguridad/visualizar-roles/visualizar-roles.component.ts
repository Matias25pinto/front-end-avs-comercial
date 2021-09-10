import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

@Component({
  selector: 'app-visualizar-roles',
  templateUrl: './visualizar-roles.component.html',
})
export class VisualizarRolesComponent implements OnInit {
  public roles: any[] = [
    { id: 1, rol: 'inventario', descripcion: 'es una descripción' },
  ];
  constructor(private router: Router) {}

  ngOnInit(): void {}

  modificarRol(id: number): void {
    this.router.navigate(['seguridad', 'modificar-rol', id]);
  }

  eliminarRol(articulo: string) {
    let titulo = `Eliminar ${articulo} !!!`;
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
        text: '¿Está seguro de eliminar el Rol? ',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, para eliminar el rol!',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire(
            'Eliminado!!!',
            'El rol fue eliminado con éxito!!!',
            'success'
          );
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelado!!!',
            'El rol no fue eliminado.',
            'error'
          );
        }
      });
  }
}
