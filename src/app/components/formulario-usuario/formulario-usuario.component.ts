import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-formulario-usuario',
  templateUrl: './formulario-usuario.component.html',
})
export class FormularioUsuarioComponent implements OnInit {
  @Input() isModified: any;

  @Input() usuario: any;
  public formularioUsuario: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formularioUsuario = this.fb.group({
      first_name: [''],
      last_name: [''],
      email: [''],
      rol:[''],
    });
  }

  ngOnInit(): void {
    if (this.isModified) {
      this.formularioUsuario.reset({
        first_name: this.usuario.first_name,
        last_name: this.usuario.last_name,
        email: this.usuario.email,
	rol:this.usuario.rol
      });
    }
  }
}
