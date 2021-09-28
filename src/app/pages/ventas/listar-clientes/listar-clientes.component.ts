import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

import { PersonaService } from '../../../services/persona.service';
import { Persona } from '../../../models/persona.interface';

import { environment } from '../../../../environments/environment';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-listar-clientes',
  templateUrl: './listar-clientes.component.html',
})
export class ListarClientesComponent implements OnInit {
  public url = environment.url;
  public clientes: Persona[] = [];
  public siguiente: string = '';
  public anterior: string = '';
  public isLoading: boolean = false;
  public isError: boolean = false;
  public urlActual: string = '';

  public formularioBuscar: FormGroup;

  constructor(
    private router: Router,
    private personaService: PersonaService,
    private fb: FormBuilder
  ) {
    this.formularioBuscar = this.fb.group({
      cliente: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.cargarClientes(`${this.url}/personas/clientes/`);
  }

  limpiarFormulario() {
    this.formularioBuscar.reset({ clientes: '' });
  }

  enviarFormulario() {
    if (this.formularioBuscar.valid) {
      const termino = this.formularioBuscar.get('cliente')?.value;
      const pagina: string = `${this.url}/personas/busqueda/?search=${termino}`;
      this.buscarClientes(pagina);
    } else {
      this.cargarClientes(`${this.url}/personas/clientes/`);
    }
  }

  buscarClientes(pagina: string) {
    this.isLoading = true;
    this.isError = false;
    this.clientes = [];
    this.siguiente = '';
    this.anterior = '';
    this.personaService.getPersonas(pagina).subscribe(
      (data) => {
        this.clientes = data.results;
        this.siguiente = data.next != null ? data.next : '';
        this.anterior = data.previous != null ? data.previous.toString() : '';
        this.urlActual = pagina;
        this.isLoading = false;
        if (this.clientes.length === 0) {
          this.isError = true;
        }
      },
      (err) => {
        this.urlActual = pagina;
        this.isLoading = false;
        this.isError = true;
        console.warn(err);
      }
    );
  }

  cargarClientes(pagina: string) {
    this.isLoading = true;
    this.clientes = [];
    this.siguiente = '';
    this.anterior = '';
    this.personaService.getPersonas(pagina).subscribe(
      (data) => {
        this.clientes = data.results;
        this.siguiente = data.next != null ? data.next : '';
        this.anterior = data.previous != null ? data.previous.toString() : '';
        this.urlActual = pagina;
        this.isLoading = false;
      },
      (err) => {
        this.urlActual = pagina;
        this.isLoading = false;
        this.isError = true;
        console.warn(err);
      }
    );
  }

  modificarCliente(id: number) {
    this.router.navigate(['ventas', 'modificar-cliente', id]);
  }

  eliminarCliente(cliente: string, id: number) {
    let titulo = `Eliminar Cliente !!!`;
    let message = `¿Está seguro de eliminar al cliente ${cliente}? `;
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: titulo,
        text: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, para eliminar el cliente!',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.personaService
            .deletePersona(`${this.url}/personas/${id}/`)
            .subscribe(
              (resp: any) => {
                if (this.urlActual != `${this.url}/personas/clientes/`) {
                  this.cargarClientes(`${this.urlActual}`);
                } else {
                  this.cargarClientes(`${this.url}/personas/clientes/`);
                }
                swalWithBootstrapButtons.fire(
                  'Eliminado!!!',
                  'El cliente fue eliminado con éxito!!!',
                  'success'
                );
              },
              (err: any) => {
                swalWithBootstrapButtons.fire(
                  'ERROR!!!',
                  'El cliente no fue eliminado.',
                  'error'
                );
              }
            );
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelado!!!',
            'El cliente no fue eliminado.',
            'error'
          );
        }
      });
  }
}
