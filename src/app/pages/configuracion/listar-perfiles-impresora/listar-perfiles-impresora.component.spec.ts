import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPerfilesImpresoraComponent } from './listar-perfiles-impresora.component';

describe('ListarPerfilesImpresoraComponent', () => {
  let component: ListarPerfilesImpresoraComponent;
  let fixture: ComponentFixture<ListarPerfilesImpresoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarPerfilesImpresoraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarPerfilesImpresoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
