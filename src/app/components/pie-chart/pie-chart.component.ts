import { Component, OnInit, Input } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'ng2-charts';
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
})
export class PieChartComponent implements OnInit {
  @Input() variables: string[] = [];
  @Input() valorVariables: number[] = [];
  @Input() totalVariables: number = 0;
  @Input() titulo:string = "";
  //GRAFICOS DE CHARTS
  // Pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'left',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    },
  };
  public porcentajeVentasNeta: number[] = [];
  public pieChartLabels: Label[] = this.variables;
  public pieChartData: number[] = this.valorVariables;
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];
  constructor() {}

  ngOnInit(): void {
    this.pieChartLabels = this.variables;
    this.pieChartData = this.valorVariables.map((data) => {
      return Math.round((data / this.totalVariables) * 100);
    });
  }
}
