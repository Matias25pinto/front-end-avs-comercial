import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Articulo } from 'src/app/models/articulo.interface';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ver-articulos',
  templateUrl: './ver-articulos.component.html',
})
export class VerArticulosComponent implements OnInit {

  public articulos:Array<Articulo> = [{
    id:123,
    codigo:123,
    nombre:'Articulo 1',
    costo:20000,
    porc_iva:10,
    porc_comision:5,
    stock_actual:100,
    stock_minimo:10,
    ultima_compra:'19/08/2021',
    unidad_medida:'unidad',
    precio_unitario:5000,
    precio_mayorista:4000,
    precio_especial:3500
  }];

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  modificarArticulo(id?:number){

    this.router.navigate(['inventario','modificar-articulo',id]);
  }

  eliminarArticulo(articulo:string){
    let titulo = `Eliminar ${articulo} !!!`;
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: titulo,
      text: "¿Está seguro de eliminar el artículo? ",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, para eliminar el artículo!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          'Eliminado!!!',
          'El artículo fue eliminado con éxito!!!',
          'success'
        )
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado!!!',
          'El artículo no fue eliminado.',
          'error'
        )
      }
    })
  }

}
