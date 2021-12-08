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
  //PIE-1
  //OBJETO DE PRODUCTOS ESTO DEBE VENIR DEL BACK-END
  public productos: any[] = [
    { nombre: 'producto1', totalVenta: 400000, totalGanancia: 150000 },
    { nombre: 'producto2', totalVenta: 200000, totalGanancia: 100000 },
    { nombre: 'producto3', totalVenta: 400000, totalGanancia: 200000 },
    { nombre: 'producto4', totalVenta: 300000, totalGanancia: 150000 },
    { nombre: 'producto5', totalVenta: 500000, totalGanancia: 200000 },
  ];
  public vendedores: any[] = [
    { nombre: 'vendedor 1', totalVenta: 300000 },
    { nombre: 'vendedor 2', totalVenta: 400000 },
    { nombre: 'vendedor 3', totalVenta: 500000 },
    { nombre: 'vendedor 4', totalVenta: 200000 },
  ];
  //Total General
  public totalVentas:number = 1000000;
  public totalCompras:number = 400000;
  //CALCULOS EN EL FRONT-END CON LA DATA productos
  public nombreProductos: string[] = [];
  public totalVentasPie: number = 0;
  public subTotalVentaPie: number[] = [];
  public titulo1 = 'Los 5 productos más vendidos';

  //BAR-1
  public titulo2 = 'Total de Ventas de los vendedores';
  public variables2 = [];
  public serie1 = 'Total Ventas Gs.';
  public valorVariablesSerie1 = [];
  public nombreVendedores: string[] = [];

  //General
  public cantidadVentasDias = 0;

  constructor(private reportes: ReportesService, private fb: FormBuilder) {
    this.formulario = this.fb.group({ fechaInicio: [''], fechaFin: [''] });
    //Calculo para pie-1
    this.productos.map((producto) => {
      this.nombreProductos.push(producto.nombre);
      this.subTotalVentaPie.push(producto.totalVenta);
      this.totalVentasPie = this.totalVentasPie + producto.totalVenta;
    });

    //calculo para bar-1
    this.vendedores.map((vendedor) => {
      this.nombreVendedores.push(vendedor.nombre);
      this.valorVariablesSerie1.push(vendedor.totalVenta);
    });
  }

  ngOnInit(): void {
    this.cargarFecha();
  }
  cargarFecha() {
    const fecha = new Date();
    const month = fecha.getMonth() + 1;
    const year = fecha.getFullYear();
    const fechaInicio = new Date(`${year}/${month}/${1}`);
    const fechaFin = new Date(
      `${year}/${month < 12 ? month - 1 : month}/${month < 12 ? 0 : 31}`
    );
    this.formulario.reset({ fechaInicio: fechaInicio, fechaFin: fechaFin });
  }
  enviarFormulario() {
    if (this.formulario.valid) {
      const fechaInicio = this.formulario.get('fechaInicio')?.value;
      const fechaFin = this.formulario.get('fechaFin')?.value;

      console.log('fechaInicio: ', fechaInicio, ' fechaFin: ', fechaFin);
    }
  }
}
