import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionFichajesPage } from './gestion-fichajes.page';

describe('GestionFichajesPage', () => {
  let component: GestionFichajesPage;
  let fixture: ComponentFixture<GestionFichajesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionFichajesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
