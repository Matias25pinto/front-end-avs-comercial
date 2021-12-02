export interface DetalleVenta {
  estado: string;
  fecha_creacion: string;
  cantidad: number;
  sub_total: number;
  id_articulo: number;
  nombre_articulo: string;
  sub_total_iva: number;
  tipo_iva: number;
  precio_unitario: number;
  codigo_articulo: number;
}
export interface Venta {
  id_detalle_venta: Array<DetalleVenta>;
  id_venta: number;
  estado: string;
  fecha_creacion: string;
  fecha: string;
  total: number;
  id_cliente: number;
  facutra?: string;
  tipo_factura: string;
  monto_letras?: string;
  numero_factura?: string;
}
export interface NotaCredito {
  id_venta: number;
  fecha?: string;
  monto_total: number;
  id_detalle_nota_credito: Array<any>;
}
export interface DetalleNotaCredito {
  id_venta:number;
  cantidad: number;
  id_articulo: number;
}
