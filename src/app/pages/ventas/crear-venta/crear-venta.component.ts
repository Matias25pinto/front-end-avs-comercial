import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PersonaService } from '../../../services/persona.service';
import { Persona } from '../../../models/persona.interface';
import { ArticulosService } from '../../../services/articulos.service';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

interface Grilla {
  id_articulo: number;
  nombre: string;
  codigo_barras: string;
  precio: number;
  cantidad: number;
  unidad_medida: number;
  tipo_precio: string;
  porc_iva: number;
}
@Component({
  selector: 'app-crear-venta',
  templateUrl: './crear-venta.component.html',
})
export class CrearVentaComponent implements OnInit {
  public isModal = false;
  public isLoadingCliente = false;
  public clientes: Persona[] = [];
  public articulos: any[] = [];
  public grilla: any[] = [];
  public totalVenta: number = 0;
  public iva10: number = 0;
  public iva5: number = 0;
  public exenta: number = 0;
  public formularioVenta: FormGroup;
  public formularioGrilla: FormGroup;
  constructor(
    private fb: FormBuilder,
    private personaService: PersonaService,
    private articulosService: ArticulosService
  ) {
    this.formularioVenta = this.fb.group({
      cliente: ['', [Validators.required]],
      importe: ['', [Validators.required]],
    });
    this.formularioGrilla = this.fb.group({
      codigo: ['', [Validators.required]],
      cantidad: [1, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.cargarClientes();
    this.cargarArticulos();
  }
  cargarArticulos() {
    this.articulosService.getArticulosLista().subscribe((articulos) => {
      this.articulos = articulos;
    });
  }
  cargarClientes() {
    this.personaService.getPersonasLista().subscribe((resp) => {
      this.clientes = resp;
    });
  }
  addCliente(elemento: HTMLInputElement) {
    this.isModal = true;
    elemento.click();
  }
  public handleKeyDownGrilla(event: any) {
    //keycode de enter es 13
    if (event.keyCode == 13) {
      this.enviarFormularioGrilla();
    }
  }
  agregarGrilla(codigo: string, cantidadString: string) {
    let articulo = this.articulos.find((articulo) => {
      if (articulo.codigo_barras == codigo) {
        return articulo;
      }
    });
    if (articulo) {
      let precio = 0;
      let viejoArticulo = this.grilla.find((articulo) => {
        if (articulo.codigo_barras == codigo) {
          return articulo;
        }
      });
      let cantidad = viejoArticulo
        ? viejoArticulo.cantidad + parseInt(cantidadString)
        : parseInt(cantidadString);
      let tipo_precio = '';
      if (cantidad < 3) {
        precio = articulo.precio_unitario;
        tipo_precio = 'Unitario';
      } else if (cantidad >= 3 && cantidad < 12) {
        precio = articulo.precio_mayorista;
        tipo_precio = 'Mayorista';
      } else if (cantidad >= 12) {
        precio = articulo.precio_especial;
        tipo_precio = 'Especial';
      }

      let articuloGrilla: Grilla = {
        id_articulo: articulo.id_articulo,
        nombre: articulo.nombre,
        codigo_barras: articulo.codigo_barras,
        precio,
        cantidad,
        unidad_medida: articulo.unidad_medida,
        tipo_precio,
        porc_iva: articulo.porc_iva,
      };
      let result = this.grilla;
      if (viejoArticulo) {
        result = this.grilla.filter((articulo) => {
          if (articulo.codigo_barras != codigo) {
            return articulo;
          }
        });
      }

      console.log(articuloGrilla);
      this.grilla = [articuloGrilla, ...result];
      this.actualizarPanel();
      this.limpiarFormularioGrilla();
    }
  }
  actualizarPanel() {
    this.totalVenta = 0;
    this.iva10 = 0;
    this.grilla.map((articulo) => {
      console.log(articulo.precio, articulo.cantidad);
      this.totalVenta = this.totalVenta + articulo.precio * articulo.cantidad;
      if (articulo.porc_iva == 10) {
        this.iva10 = this.iva10 + (articulo.precio * articulo.cantidad) / 11;
      }
      if (articulo.porc_iva == 5) {
        this.iva5 = this.iva5 + (articulo.precio * articulo.cantidad) / 21;
      }
      if (articulo.porc_iva == 0) {
        this.exenta = this.exenta + (articulo.precio * articulo.cantidad);
      }
    });
  }
  eliminarGrilla(id_articulo: number) {
    let articulo = this.grilla.find((articulo) => {
      if (articulo.id_articulo == id_articulo) {
        return articulo;
      }
    });
    console.log(articulo);
    let titulo = `Eliminar Artículo!!!`;
    let message = `¿Está seguro de eliminar el artículo ${articulo.nombre} de la venta? `;
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
        confirmButtonText: 'Si, para eliminar el artículo',
        cancelButtonText: 'No, para cancelar!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          let articulos = this.grilla.filter((articulo) => {
            if (articulo.id_articulo != id_articulo) {
              return articulo;
            }
          });
          this.grilla = [...articulos];
          this.actualizarPanel();
          swalWithBootstrapButtons.fire(
            'Eliminado!!!',
            `El artículo fue eliminado con éxito!!!`,
            'success'
          );
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelado!!!',
            `El artículo no fue eliminado.`,
            'error'
          );
        }
      });
  }
  public handleKeyDownPagar(event: any, id_usuario: any, importe: string) {
    //keycode de enter es 13
    if (event.keyCode == 13) {
      if (parseInt(importe) > 0) {
        console.log(id_usuario, importe);
      }
    }
  }
  enviarFormularioGrilla() {
    if (this.formularioGrilla.valid) {
      const codigo = this.formularioGrilla.get('codigo')?.value;
      const cantidad = this.formularioGrilla.get('cantidad')?.value;
      if (codigo != '' && parseInt(cantidad) > 0) {
        this.agregarGrilla(codigo, cantidad);
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El campo código del artículo y la cantidad son obligatorios',
        footer: '<p>Verificar el campo código y el campo cantidad</p>',
      });
    }
  }
  limpiarFormularioGrilla() {
    this.formularioGrilla.reset({ codigo: '', cantidad: 1 });
  }
  limpiarFormularioVenta() {
    this.formularioVenta.reset({ cliente: '', importe: '' });
    this.grilla = [];
    this.totalVenta = 0;
    this.iva10 = 0;
    this.iva5 = 0;
    this.exenta = 0;
  }
  enviarFormularioVenta() {
    if (this.formularioVenta.valid && this.totalVenta > 0) {
      const id_cliente = this.formularioVenta.get('cliente')?.value;
      const importe = this.formularioVenta.get('importe')?.value;
      if (importe >= this.totalVenta) {
        console.log(this.formularioVenta.value);
        console.log(this.grilla);
        this.limpiarFormularioGrilla();
        this.limpiarFormularioVenta();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Importe Insuficiente',
          text: 'El monto del importe debe ser mayor o igual al total de la venta',
        });
        console.log('Importe insuficiente');
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El campo cliente y el importe son obligatorios',
        footer: '<p>Verificar el campo cliente y el campo importe</p>',
      });

      console.log('Formulario Venta no válido');
    }
  }
}
