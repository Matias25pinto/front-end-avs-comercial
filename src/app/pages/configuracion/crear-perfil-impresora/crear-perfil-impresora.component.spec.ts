import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearPerfilImpresoraComponent } from './crear-perfil-impresora.component';

describe('CrearPerfilImpresoraComponent', () => {
  let component: CrearPerfilImpresoraComponent;
  let fixture: ComponentFixture<CrearPerfilImpresoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearPerfilImpresoraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearPerfilImpresoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
