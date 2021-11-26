export interface DetalleVenta{
  estado:string;
  fecha_creacion:string;
  cantidad:number;
  sub_total:number;
  id_articulo:number;
}
export interface Venta{
  id_detalle_venta:Array<DetalleVenta>;
  id_venta:number;
  estado:string;
  fecha_creacion:string;
  fecha:string;
  total:number;
  id_cliente:number;
  facutra?:string;
}
