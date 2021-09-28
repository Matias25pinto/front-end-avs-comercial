import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-formulario-persona',
  templateUrl: './formulario-persona.component.html',
})
export class FormularioPersonaComponent implements OnInit {
  public formularioPersona: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formularioPersona = this.fb.group({
      tipo_persona: ['F', Validators.required],
      nombre_apellido: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      ruc: ['', Validators.required],
      cedula: ['', Validators.required],
      correo_electronico: ['', Validators.required],
      fecha_nacimiento: [''],
    });
  }

  ngOnInit(): void {}

  enviarFormulario() {
    if (this.formularioPersona.valid) {
      const fecha_nacimiento = "1993-02-25";
      const es_cliente = "V";
      const propietario = "N";
      const es_proveedor = "F";
      const estado_activo = "V";
      
      let persona = {
        tipo_persona: this.formularioPersona.get('tipo_persona')?.value,
        nombre_apellido: this.formularioPersona.get('nombre_apellido')?.value,
        propietario,
        direccion: this.formularioPersona.get('direccion')?.value,
        telefono: this.formularioPersona.get('telefono')?.value,
        ruc: this.formularioPersona.get('ruc')?.value,
        cedula: this.formularioPersona.get('cedula')?.value,
        correo_electronico: this.formularioPersona.get('correo_electronico')?.value,
        es_cliente,
        es_proveedor,
        fecha_nacimiento,
        estado_activo,
      };
      console.log(persona);
    } else {
      console.log("Formulario no válido");

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
}
