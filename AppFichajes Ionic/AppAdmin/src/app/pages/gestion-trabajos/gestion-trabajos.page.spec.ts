import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionTrabajosPage } from './gestion-trabajos.page';

describe('GestionTrabajosPage', () => {
  let component: GestionTrabajosPage;
  let fixture: ComponentFixture<GestionTrabajosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionTrabajosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
