import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ArticulosService } from '../../../services/articulos.service';
import { Articulo } from '../../../models/articulo.interface';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modificar-stock',
  templateUrl: './modificar-stock.component.html',
})
export class ModificarStockComponent implements OnInit {
  public formularioModificarStock: FormGroup;
  public articulo: Articulo;
  public url = environment.url;
  public isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private articulosService: ArticulosService
  ) {
    this.route.params.subscribe((params) => {
      this.cargarArticulo(params.id);
    });

    this.formularioModificarStock = this.fb.group({
      motivo_ajuste: ['', [Validators.required]],
      tipo_ajuste: ['A', [Validators.required]],
      cantidad: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  cargarArticulo(id_articulo: number) {
    this.articulosService
      .getArticulo(`${this.url}/articulos/${id_articulo}/`)
      .subscribe((resp) => {
        this.articulo = resp;
        console.log(resp);
      });
  }
  limpiarFormulario() {
    this.formularioModificarStock.reset({
      motivo_ajuste: '',
      tipo_ajuste: 'A',
      cantidad: '',
    });
  }
  enviarFormulario() {
    if (this.formularioModificarStock.valid) {
      this.isLoading = true;
      const tipo_ajuste =
        this.formularioModificarStock.get('tipo_ajuste')?.value;
      const motivo_ajuste =
        this.formularioModificarStock.get('motivo_ajuste')?.value;
      const cantidad = this.formularioModificarStock.get('cantidad')?.value;
      const id_articulo = this.articulo.id_articulo;
      const body = { tipo_ajuste, motivo_ajuste, cantidad, id_articulo };
      this.articulosService.ajustarStockArticulo(body).subscribe(
        (data) => {
	  console.log("DATA", data);
          this.limpiarFormulario();
          this.isLoading = false;
	  this.cargarArticulo(id_articulo);
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Stock Actualizado exitosamente.',
            showConfirmButton: false,
            timer: 1500,
          });
        },
        (err) => {
          this.isLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No es posible actualizar el stock  del artículo.',
            footer: '',
          });
          console.warn('ERROR!!!', err);
        }
      );
    } else {
      Object.values(this.formularioModificarStock.controls).forEach(
        (control) => {
          //control instanceof FormGroup; Si es true es porque control es una instancia de FormGroup por lo tanto es otro formGroup para recorrer
          if (control instanceof FormGroup) {
            Object.values(control.controls).forEach((control) =>
              control.markAllAsTouched()
            ); //de esta forma markAllAsTouched(); esta marcando como editados a todos los inputs, Touched:que se toco
          } else {
            control.markAsTouched();
          }
        }
      );
    }
  }
}
