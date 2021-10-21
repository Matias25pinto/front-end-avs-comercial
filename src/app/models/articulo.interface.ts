export interface Articulo{
  id_articulo:number;
  id_marca: number;
  codigo_barras:number;
  nombre: string;
  costo:number;
  porc_iva:number;
  porc_comision:number;
  stock_actual:number;
  stock_minimo:number;
  ultima_compra:string;
  unidad_medida:string;
  precio_unitario:number;
  precio_mayorista:number;
  precio_especial:number;
}
