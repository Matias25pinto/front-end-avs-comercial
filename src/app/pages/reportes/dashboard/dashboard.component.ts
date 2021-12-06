import { Component, OnInit } from '@angular/core';
import { ReportesService } from '../../../services/reportes.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  //PIE-1
  //OBJETO DE PRODUCTOS ESTO DEBE VENIR DEL BACK-END
  public productos: any[] = [
    { nombre: 'producto1', totalVenta: 400000, totalGanancia: 150000 },
    { nombre: 'producto2', totalVenta: 200000, totalGanancia: 100000 },
    { nombre: 'producto3', totalVenta: 400000, totalGanancia: 200000 },
    { nombre: 'producto4', totalVenta: 300000, totalGanancia: 150000 },
    { nombre: 'producto5', totalVenta: 500000, totalGanancia: 200000 },
  ];
  //CALCULOS EN EL FRONT-END CON LA DATA productos
  public nombreProductos: string[] = [];
  public subTotalVenta: number[] = [];
  public totalVentas: number = 0;
  public titulo1 = 'Los 5 productos más vendidos';

  //BAR-1
  public titulo2 = 'Los 5 productos más vendidos en guaranies';
  public variables2 = [];
  public serie1 = 'Total Venta';
  public valorVariablesSerie1 = [];
  public serie2 = 'Total Ganancia';
  public valorVariablesSerie2 = [];

  //General
  public cantidadVentasDias = 0;

  constructor(private reportes:ReportesService) {
        //Calculo para pie-1
    this.productos.map((producto) => {
      this.nombreProductos.push(producto.nombre);
      this.subTotalVenta.push(producto.totalVenta);
      this.valorVariablesSerie1.push(producto.totalVenta);
      this.valorVariablesSerie2.push(producto.totalGanancia);
      this.totalVentas = this.totalVentas + producto.totalVenta;
    });
  }

  ngOnInit(): void {}
}
