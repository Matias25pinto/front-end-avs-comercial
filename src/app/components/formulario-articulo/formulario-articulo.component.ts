import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-formulario-articulo',
  templateUrl: './formulario-articulo.component.html',
})
export class FormularioArticuloComponent implements OnInit {

  @Input() articulo: any;
  @Input() crearArticulo:any;
   public formularioArticulo: FormGroup;
  constructor(private fb:FormBuilder) {
    this.formularioArticulo = this.fb.group({
      codigo:[''],
      nombre:[''],
      costo:[''],
      porc_iva:[''],
      porc_comision:[''],
      stock_actual:[''],
      stock_minimo:[''],
      utilma_compra:[''],
      unidad_medida:[''],
      precio_unitario:[''],
      precio_mayorista:[''],
      precio_especial:['']
    });
  }

  ngOnInit(): void {
    console.log(this.articulo)
    console.log(this.crearArticulo);
    if(!this.crearArticulo){
      this.formularioArticulo.reset({
        codigo:this.articulo.codigo,
        nombre:this.articulo.nombre,
        costo:this.articulo.costo,
        porc_iva:this.articulo.porc_iva,
        porc_comision:this.articulo.porc_comision,
        stock_actual:this.articulo.stock_actual,
        stock_minimo:this.articulo.stock_minimo,
        utilma_compra:this.articulo.ultima_compra,
        unidad_medida:this.articulo.unidad_medida,
        precio_unitario:this.articulo.precio_unitario,
        precio_mayorista:this.articulo.precio_mayorista,
        precio_especial:this.articulo.precio_especial

      })

      console.log('cargar datos del articulo');
    }
  }
}
