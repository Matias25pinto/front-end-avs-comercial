import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarPerfilImpresoraComponent } from './modificar-perfil-impresora.component';

describe('ModificarPerfilImpresoraComponent', () => {
  let component: ModificarPerfilImpresoraComponent;
  let fixture: ComponentFixture<ModificarPerfilImpresoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificarPerfilImpresoraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarPerfilImpresoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
