import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

import { ArticulosService } from '../../services/articulos.service';

import { Articulo } from '../../models/articulo.interface';

import { environment } from '../../../environments/environment';

import { Marca } from '../../models/marca.interface';

import { MarcasService } from '../../services/marcas.service';

@Component({
  selector: 'app-formulario-articulo',
  templateUrl: './formulario-articulo.component.html',
})
export class FormularioArticuloComponent implements OnInit {
  @Input() isCreateArticulo: boolean = false;
  @Input() id_articulo: number = 0;

  public formulario: FormGroup;
  public isLoading: boolean = false;
  public marcas: Marca[] = [];
  public marcasDesc: string[] = [];
  public loadingMarca = false;
  public stockActual = 0;
  private url = environment.url;

  constructor(
    private fb: FormBuilder,
    private articulosService: ArticulosService,
    private marcasServices: MarcasService
  ) {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      id_marca: ['', [Validators.required]],
      codigo_barras: [
        '',
        [Validators.required, Validators.pattern('[0-9]{1,13}$')],
      ],
      costo: ['', [Validators.required, Validators.pattern('[0-9]{1,13}$')]],
      porc_iva: [10, [Validators.required, Validators.pattern('[0-9]{1,2}$')]],
      porc_comision: [
        '',
        [Validators.required, Validators.pattern('[0-9]{1,13}$')],
      ],
      stock_minimo: [
        '',
        [Validators.required, Validators.pattern('[0-9]{1,13}$')],
      ],
      unidad_medida: ['UN', [Validators.required]],
      precio_unitario: [
        '',
        [Validators.required, Validators.pattern('[0-9]{1,13}$')],
      ],
      precio_mayorista: [
        '',
        [Validators.required, Validators.pattern('[0-9]{1,13}$')],
      ],
      precio_especial: [
        '',
        [Validators.required, Validators.pattern('[0-9]{1,13}$')],
      ],
    });
  }

  ngOnInit(): void {
    this.cargarMarcas();
    if (!this.isCreateArticulo) {
      this.cargarFormulario();
    }
  }
  get nombreNoValido(): boolean {
    return (
      (this.formulario.get('nombre')?.invalid &&
        this.formulario.get('nombre')?.touched) ||
      false
    );
  }

  get codigo_barrasNoValido(): boolean {
    return (
      (this.formulario.get('codigo_barras')?.invalid &&
        this.formulario.get('codigo_barras')?.touched) ||
      false
    );
  }
  get id_marcaNoValido(): boolean {
    return (
      (this.formulario.get('id_marca')?.invalid &&
        this.formulario.get('id_marca')?.touched) ||
      false
    );
  }
  get costoNoValido(): boolean {
    return (
      (this.formulario.get('costo')?.invalid &&
        this.formulario.get('costo')?.touched) ||
      false
    );
  }
  get porc_ivaNoValido(): boolean {
    return (
      (this.formulario.get('porc_iva')?.invalid &&
        this.formulario.get('porc_iva')?.touched) ||
      false
    );
  }

  get porc_comisionNoValido(): boolean {
    return (
      (this.formulario.get('porc_comision')?.invalid &&
        this.formulario.get('porc_comision')?.touched) ||
      false
    );
  }
  get stock_minimoNoValido(): boolean {
    return (
      (this.formulario.get('stock_minimo')?.invalid &&
        this.formulario.get('stock_minimo')?.touched) ||
      false
    );
  }

  get unidad_medidaNoValido(): boolean {
    return (
      (this.formulario.get('unidad_medida')?.invalid &&
        this.formulario.get('unidad_medida')?.touched) ||
      false
    );
  }

  get precio_unitarioNoValido(): boolean {
    return (
      (this.formulario.get('precio_unitario')?.invalid &&
        this.formulario.get('precio_unitario')?.touched) ||
      false
    );
  }
  get precio_mayoristaNoValido(): boolean {
    return (
      (this.formulario.get('precio_mayorista')?.invalid &&
        this.formulario.get('precio_mayorista')?.touched) ||
      false
    );
  }
  get precio_especialNoValido(): boolean {
    return (
      (this.formulario.get('precio_especial')?.invalid &&
        this.formulario.get('precio_especial')?.touched) ||
      false
    );
  }
  cargarMarcas() {
    this.marcasServices.getMarcas().subscribe((resp) => {
      this.marcasDesc = resp.map((marca) => {
        return marca.descripcion;
      });

      this.marcas = resp;
    });
  }
  addMarca(input: HTMLInputElement) {
    const value = input.value;
    if (this.marcasDesc.indexOf(value) === -1 && input.value != '') {
      this.loadingMarca = true;
      let fecha = new Date();
      const fecha_creacion = `${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}`;
      const body: Marca = {
        id_marca: value.split(' ').join('-'),
        descripcion: value,
        estado: 'A',
        fecha_creacion,
      };
      this.marcasServices.crearMarca(body).subscribe(
        (resp) => {
          console.log(resp);
          this.cargarMarcas();
          this.loadingMarca = false;
        },
        (err) => {
          console.log(err);
          this.loadingMarca = false;
        }
      );
    }
  }
  cargarFormulario() {
    this.articulosService
      .getArticulo(`${this.url}/articulos/${this.id_articulo}/`)
      .subscribe((articulo) => {
        this.formulario.reset({
          nombre: articulo.nombre,
          id_marca: articulo.id_marca,
          codigo_barras: articulo.codigo_barras,
          costo: articulo.costo,
          porc_iva: articulo.porc_iva,
          porc_comision: articulo.porc_comision,
          stock_minimo: articulo.stock_minimo,
          unidad_medida: articulo.unidad_medida,
          precio_unitario: articulo.precio_unitario,
          precio_mayorista: articulo.precio_mayorista,
          precio_especial: articulo.precio_especial,
        });
	this.stockActual = articulo.stock_actual;
      });
  }

  enviarFormulario() {
    console.log(this.formulario.valid);
    if (this.formulario.valid) {
      this.isLoading = true;
      let fecha = new Date();
      const ultima_compra = `${fecha.getFullYear()}-${
        fecha.getMonth() + 1
      }-${fecha.getDate()}`;

      let body: Articulo = {
        id_articulo: this.id_articulo,
        nombre: this.formulario.get('nombre')?.value,
        id_marca: this.formulario.get('id_marca')?.value,
        codigo_barras: this.formulario.get('codigo_barras')?.value,
        costo: this.formulario.get('costo')?.value,
        porc_iva: this.formulario.get('porc_iva')?.value,
        porc_comision: this.formulario.get('porc_comision')?.value,
        stock_minimo: this.formulario.get('stock_minimo')?.value,
        stock_actual: this.stockActual,
        unidad_medida: this.formulario.get('unidad_medida')?.value,
        precio_unitario: this.formulario.get('precio_unitario')?.value,
        precio_mayorista: this.formulario.get('precio_mayorista')?.value,
        precio_especial: this.formulario.get('precio_especial')?.value,
        ultima_compra,
      };
      if (this.isCreateArticulo) {
        this.crearArticulo(body);
      } else {
        this.modificarArticulo(body);
      }
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
  crearArticulo(body: Articulo) {
    this.articulosService.crearArticulo(body).subscribe(
      (data) => {
        this.limpiarFormulario();
        this.isLoading = false;
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Artículo agregado exitosamente.',
          showConfirmButton: false,
          timer: 1500,
        });
      },
      (err) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No es posible agregar el artículo.',
          footer: '',
        });
        console.warn('ERROR!!!', err);
      }
    );
  }
  modificarArticulo(body: Articulo) {
    this.articulosService.actualizarArticulo(body).subscribe(
      (data) => {
        this.isLoading = false;
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Artículo actualizado.',
          showConfirmButton: false,
          timer: 1500,
        });
      },
      (err) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No es posible actualizar los datos del artículo.',
          footer: '',
        });
        console.warn('ERROR!!!', err);
      }
    );
  }
  limpiarFormulario() {
    this.formulario.reset({
      nombre: '',
      id_marca: '',
      codigo_barras: '',
      costo: '',
      porc_iva: 10,
      porc_comision: '',
      stock_minimo: '',
      unidad_medida: 'UN',
      precio_unitario: '',
      precio_mayorista: '',
      precio_especial: '',
    });
  }
}
