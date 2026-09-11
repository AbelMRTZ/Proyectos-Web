import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonSearchbar, IonInput } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { ApiService, Fichaje, Usuario, Trabajo } from '../../services/api';

@Component({
  selector: 'app-gestion-fichajes',
  templateUrl: './gestion-fichajes.page.html',
  styleUrls: ['./gestion-fichajes.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonList, IonItem, IonLabel, IonButton, IonSearchbar, IonInput,
    CommonModule, FormsModule, RouterLink
  ]
})
export class GestionFichajesPage implements OnInit {
  fichajes: Fichaje[] = [];
  filtrados: Fichaje[] = [];
  usuarios: Usuario[] = [];
  trabajos: Trabajo[] = [];
  cargando = false;

  search = '';
  desde = '';
  hasta = '';

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.cargarAux();
    this.cargarFichajes();
  }

  cargarAux() {
    this.api.getUsuarios().subscribe({ next: u => this.usuarios = u || [] });
    this.api.getTrabajos().subscribe({ next: t => this.trabajos = t || [] });
  }

  cargarFichajes() {
    this.cargando = true;
    const usarRango = !!(this.desde && this.hasta);
    const obs = usarRango
      ? this.api.getFichajesRango({ desde: this.desde, hasta: this.hasta })
      : this.api.getFichajes({ desde: this.desde || undefined, hasta: this.hasta || undefined });
    obs.subscribe({
      next: (data) => {
        this.fichajes = Array.isArray(data) ? data : [];
        this.aplicarFiltroLocal();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando fichajes', err);
        this.cargando = false;
        alert('Error al cargar fichajes');
      }
    });
  }

  aplicarFiltroLocal() {
    const term = (this.search || '').toLowerCase().trim();
    if (!term) {
      this.filtrados = this.fichajes.slice();
      return;
    }
    this.filtrados = this.fichajes.filter(f => {
      const u = this.nombreUsuario(f.IdUsuario).toLowerCase();
      const t = this.nombreTrabajo(f.IdTrabajo).toLowerCase();
      return u.includes(term) || t.includes(term);
    });
  }

  onSearchChange(ev: any) {
    this.search = ev.detail?.value || '';
    this.aplicarFiltroLocal();
  }

  buscar() {
    this.cargarFichajes();
  }

  limpiar() {
    this.desde = '';
    this.hasta = '';
    this.search = '';
    this.cargarFichajes();
  }

  nombreUsuario(id: number) {
    return this.usuarios.find(u => u.IdUsuario === id)?.Nombre || `Usuario ${id}`;
  }

  nombreTrabajo(id: number) {
    return this.trabajos.find(t => t.IdTrabajo === id)?.Nombre || `Trabajo ${id}`;
  }

}
