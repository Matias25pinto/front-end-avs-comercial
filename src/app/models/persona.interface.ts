export interface Persona {
  id_persona: number;
  tipo_persona: string;
  nombre_apellido: string;
  propietario: string;
  direccion: string;
  telefono: string;
  ruc?: string;
  cedula: string;
  correo_electronico: string;
  es_cliente: string;
  es_proveedor: string;
  fecha_nacimiento: string;
  estado_activo: string;
}
