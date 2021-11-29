import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioPerfilImpresoraComponent } from './formulario-perfil-impresora.component';

describe('FormularioPerfilImpresoraComponent', () => {
  let component: FormularioPerfilImpresoraComponent;
  let fixture: ComponentFixture<FormularioPerfilImpresoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioPerfilImpresoraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioPerfilImpresoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
