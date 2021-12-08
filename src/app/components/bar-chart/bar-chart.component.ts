import { Component, OnInit, Input } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'ng2-charts';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
})
export class BarChartComponent implements OnInit {
  @Input() variables: string[] = [];
  @Input() serie1: string = '';
  @Input() valorVariablesSerie1: number[] = [];
  @Input() titulo: string = '';

  //Bar
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = this.variables;
  public barChartType: ChartType = 'bar';

  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: any[] = [
    { data: [], label: 'label1' },
  ];
  constructor() {}

  ngOnInit(): void {
    this.barChartLabels = this.variables;
    this.barChartData = [
      { data: this.valorVariablesSerie1, label: this.serie1 },
    ];
    console.log(this.barChartData);
  }
}
