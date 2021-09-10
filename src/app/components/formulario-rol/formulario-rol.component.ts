import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-formulario-rol',
  templateUrl: './formulario-rol.component.html',
})
export class FormularioRolComponent implements OnInit {
  @Input() isModified: any;

  @Input() rol: any;

  public formularioRol: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formularioRol = this.fb.group({
      rol: [''],
      descripcion: [''],
      seguridad: [false],
      inventario: [false],
    });
  }

  ngOnInit(): void {
    console.log(this.rol);
    if (this.isModified) {
      this.formularioRol.reset({
        rol: this.rol.rol,
        descripcion: this.rol.descripcion,
        seguridad: this.rol.seguridad,
        inventario: this.rol.inventario,
      });
    }
  }
}
