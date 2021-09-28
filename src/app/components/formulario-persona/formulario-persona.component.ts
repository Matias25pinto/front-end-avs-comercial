import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

import { PersonaService } from '../../services/persona.service';

import { Persona } from '../../models/persona.interface';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-formulario-persona',
  templateUrl: './formulario-persona.component.html',
})
export class FormularioPersonaComponent implements OnInit {
  @Input() isCreatePerson: boolean = false;
  @Input() id_persona: number = 0;
  public formularioPersona: FormGroup;
  private url = environment.url;

  private es_cliente = 'V';
  private propietario = 'N';
  private es_proveedor = 'F';
  private estado_activo = 'V';

  constructor(private fb: FormBuilder, private personaService: PersonaService) {
    this.formularioPersona = this.fb.group({
      tipo_persona: ['F', Validators.required],
      nombre_apellido: ['', [Validators.required, Validators.minLength(5)]],
      direccion: ['', [Validators.required, Validators.minLength(5)]],
      telefono: ['', [Validators.required, Validators.minLength(7)]],
      ruc: ['', [Validators.required, Validators.minLength(8)]],
      cedula: ['', [Validators.required, Validators.minLength(6)]],
      correo_electronico: [
        '',
        [
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
          Validators.required,
        ],
      ],
      fecha_nacimiento: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (!this.isCreatePerson) {
      this.cargarFormulario();
    }
  }

  get nombre_apellidoNoValido(): boolean {
    return (
      (this.formularioPersona.get('nombre_apellido')?.invalid &&
        this.formularioPersona.get('nombre_apellido')?.touched) ||
      false
    );
  }
  get fecha_nacimientoNoValido(): boolean {
    return (
      (this.formularioPersona.get('fecha_nacimiento')?.invalid &&
        this.formularioPersona.get('fecha_nacimiento')?.touched) ||
      false
    );
  }
  get cedulaNoValido(): boolean {
    return (
      (this.formularioPersona.get('cedula')?.invalid &&
        this.formularioPersona.get('cedula')?.touched) ||
      false
    );
  }

  get rucNoValido(): boolean {
    return (
      (this.formularioPersona.get('ruc')?.invalid &&
        this.formularioPersona.get('ruc')?.touched) ||
      false
    );
  }

  get direccionNoValido(): boolean {
    return (
      (this.formularioPersona.get('direccion')?.invalid &&
        this.formularioPersona.get('direccion')?.touched) ||
      false
    );
  }

  get telefonoNoValido(): boolean {
    return (
      (this.formularioPersona.get('telefono')?.invalid &&
        this.formularioPersona.get('telefono')?.touched) ||
      false
    );
  }

  get correoNoValido(): boolean {
    return (
      (this.formularioPersona.get('correo_electronico')?.invalid &&
        this.formularioPersona.get('correo_electronico')?.touched) ||
      false
    );
  }

  cargarFormulario() {
    this.personaService
      .getPersona(`${this.url}/personas/${this.id_persona}/`)
      .subscribe((person) => {
        let fechaArray = person.fecha_nacimiento.split('-');
        let fecha_nacimiento = new Date(
          parseInt(fechaArray[0]),
          parseInt(fechaArray[1]) - 1,
          parseInt(fechaArray[2])
        );
        this.formularioPersona.reset({
          tipo_persona: person.tipo_persona,
          nombre_apellido: person.nombre_apellido,
          direccion: person.direccion,
          telefono: person.telefono,
          ruc: person.ruc,
          cedula: person.cedula,
          correo_electronico: person.correo_electronico,
          fecha_nacimiento,
        });
        this.es_cliente = person.es_cliente;
        this.propietario = person.propietario;
        this.es_proveedor = person.es_proveedor;
        this.estado_activo = person.estado_activo;
      });
  }

  enviarFormulario() {
    if (this.formularioPersona.valid) {
      let fecha = this.formularioPersona.get('fecha_nacimiento')?.value;
      const fecha_nacimiento = `${fecha.getFullYear()}-${
        fecha.getMonth() + 1
      }-${fecha.getDate()}`;

      let body: Persona = {
        id_persona: this.id_persona,
        tipo_persona: this.formularioPersona.get('tipo_persona')?.value,
        nombre_apellido: this.formularioPersona.get('nombre_apellido')?.value,
        propietario: this.propietario,
        direccion: this.formularioPersona.get('direccion')?.value,
        telefono: this.formularioPersona.get('telefono')?.value,
        ruc: this.formularioPersona.get('ruc')?.value,
        cedula: this.formularioPersona.get('cedula')?.value,
        correo_electronico:
          this.formularioPersona.get('correo_electronico')?.value,
        es_cliente: this.es_cliente,
        es_proveedor: this.es_proveedor,
        fecha_nacimiento,
        estado_activo: this.estado_activo,
      };
      if (this.isCreatePerson) {
        this.crearPersona(body);
      } else {
        this.modificarPersona(body);
      }
    } else {
      Object.values(this.formularioPersona.controls).forEach((control) => {
        //control instanceof FormGroup; Si es true es porque control es una instancia de FormGroup por lo tanto es otro formGroup para recorrer
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach((control) =>
            control.markAllAsTouched()
          ); //de esta forma markAllAsTouched(); esta marcando como editados a todos los inputs, Touched:que se toco
        } else {
          control.markAsTouched();
        }
      });
    }
  }
  limpiarFormulario() {
    this.formularioPersona.reset({
      tipo_persona: 'F',
      nombre_apellido: '',
      direccion: '',
      telefono: '',
      ruc: '',
      cedula: '',
      correo_electronico: '',
      fecha_nacimiento: '',
    });
  }

  crearPersona(body: Persona) {
    this.personaService.crearPersona(body).subscribe(
      (data) => {
        this.limpiarFormulario();
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Cliente agregado exitosamente.',
          showConfirmButton: false,
          timer: 1500,
        });
      },
      (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No es posible agregar al cliente.',
          footer: '',
        });
        console.warn('ERROR!!!', err);
      }
    );
  }
  modificarPersona(body: Persona) {
    this.personaService.actualizarPersona(body).subscribe(
      (data) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Cliente actualizado.',
          showConfirmButton: false,
          timer: 1500,
        });
      },
      (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No es posible actualizar los datos del cliente.',
          footer: '',
        });
        console.warn('ERROR!!!', err);
      }
    );
  }
}
