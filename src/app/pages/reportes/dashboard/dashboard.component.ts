import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReportesService } from '../../../services/reportes.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  public formulario: FormGroup;
  public isLoading: boolean = false;
  //Total General
  public totalVentas: number = 0;
  public totalCompras: number = 0;

  //Mejor vendedor
  public mejorVendedor: any = {
    id: 0,
    nombre_vendedor: 'Vendedor',
    ventas_totales: 0,
  };

  //PIE-1
  //OBJETO DE PRODUCTOS ESTO DEBE VENIR DEL BACK-END
  public productos: any[] = [];
  public totalProductosPie: number = 0;
  public subTotalProductosPie: number[] = [];
  public titulo1 = 'Los productos más vendidos en porcentaje';
  public nombreProductos: string[] = [];

  //BAR-1
  public vendedores: any[] = [];
  public titulo2 = 'Total de Ventas de los vendedores';
  public serie1 = 'Total Ventas Gs.';
  public valorVariablesSerie1 = [];
  public nombreVendedores: string[] = [];

  //General
  public cantidadVentasDias = 0;

  constructor(
    private reportesService: ReportesService,
    private fb: FormBuilder
  ) {
    this.formulario = this.fb.group({ fechaInicio: [''], fechaFin: [''] });
  }

  ngOnInit(): void {
    this.cargarFecha();
  }
  cargarDatos(fechaInicio: string, fechaFin: string) {
    const body = { fecha_inicio: fechaInicio, fecha_fin: fechaFin };
    this.reportesService.totalCompras(body).subscribe((resp) => {
      this.totalCompras = resp['total_compras'];
    });
    this.reportesService.totalVentas(body).subscribe((resp) => {
      this.totalVentas = resp['total_ventas'];
    });

    this.reportesService.cantidadArticulosVendidos(body).subscribe((resp) => {
      this.productos = resp;
      //Calculo para pie-1
      resp.map((producto) => {
        this.nombreProductos.push(producto.nombre_articulo);
        this.subTotalProductosPie.push(producto.cantidad);
        this.totalProductosPie = this.totalProductosPie + producto.cantidad;
      });
    });

    this.reportesService.mejorVendedor(body).subscribe((resp) => {
      this.mejorVendedor = resp;
    });
    this.reportesService.getVendedores(body).subscribe((resp) => {
      this.vendedores = resp;
      //calculo para bar-1
      this.vendedores.map((vendedor) => {
        this.nombreVendedores.push(vendedor.nombre_apellido);
        this.valorVariablesSerie1.push(vendedor.total);
      });
    });
  }
  limpiarFormulario() {
    this.totalCompras = 0;
    this.totalVentas =0;
    this.productos = [];
    this.nombreProductos = [];
    this.subTotalProductosPie = [];
    this.totalProductosPie = 0;
    this.mejorVendedor = {
      id: 0,
      nombre_vendedor: 'Vendedor',
      ventas_totales: 0,
    };

    this.vendedores = [];
    this.valorVariablesSerie1 = [];
    this.nombreVendedores = [];
  }

  cargarFecha() {
    const fecha = new Date();
    const month = fecha.getMonth() + 1;
    const year = fecha.getFullYear();
    const fechaInicio = new Date(`${year}/${month}/1`);
    const fechaFin = new Date(
      `${year}/${month < 12 ? month - 1 : month}/${month < 12 ? 0 : 31}`
    );

    this.formulario.reset({ fechaInicio: fechaInicio, fechaFin: fechaFin });
    this.cargarDatos(
      `${year}-${month}-${1}`,
      `${year}-${month < 12 ? month - 1 : month}-${month < 12 ? 0 : 31}`
    );
  }
  enviarFormulario() {
    if (this.formulario.valid) {
      this.limpiarFormulario();
      const fechaInicio = this.formulario.get('fechaInicio')?.value;
      const fechaFin = this.formulario.get('fechaFin')?.value;
      this.cargarDatos(
        `${fechaInicio.getFullYear()}-${
          fechaInicio.getMonth() + 1
        }-${fechaInicio.getDate()}`,
        `${fechaFin.getFullYear()}-${
          fechaFin.getMonth() + 1
        }-${fechaFin.getDate()}`
      );
    }
  }
}
