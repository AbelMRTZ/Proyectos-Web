import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FichajeMapaPage } from './fichaje-mapa.page';

describe('FichajeMapaPage', () => {
  let component: FichajeMapaPage;
  let fixture: ComponentFixture<FichajeMapaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FichajeMapaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
