import { Component, OnInit } from '@angular/core';
import { ReportesService } from '../../../services/reportes.service';

@Component({
  selector: 'app-ver-stock-minimo',
  templateUrl: './ver-stock-minimo.component.html',
})
export class VerStockMinimoComponent implements OnInit {
  public articulos: any[] = [];
  public isLoading: boolean = true;
  public isError: boolean = false;
  public isVacio: boolean = false;
  constructor(private reportesService: ReportesService) {
    this.reportesService.getArticulosStockMinimo().subscribe(
      (resp) => {
        this.articulos = resp.filter(
          (articulo) => articulo.stock_actual <= articulo.stock_minimo
        );
        this.isLoading = false;
        if (this.articulos.length == 0) {
          this.isVacio = true;
        }
      },
      (err) => {
        this.isError = true;
      }
    );
  }

  ngOnInit(): void {}
}
