export interface Compra {}
export interface OrdenCompra {
  id_orden_compra: number;
  fecha_entrada: string;
  cantidad: number;
  precio: number;
  iva: number;
  sub_total: number;
  id_proveedor: number;
  id_articulo: number;
}
