import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonInput,
  IonModal,
  IonSegment,
  IonSegmentButton,
  IonFab,
  IonFabButton
} from '@ionic/angular/standalone';
import { ApiService, Trabajo, TrabajoCreate } from '../../services/api';

@Component({
  selector: 'app-gestion-trabajos',
  templateUrl: './gestion-trabajos.page.html',
  styleUrls: ['./gestion-trabajos.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonInput,
    IonModal,
    IonSegment,
    IonSegmentButton,
    IonFab,
    IonFabButton,
    CommonModule,
    FormsModule,
  ]
})
export class GestionTrabajosPage implements OnInit {
  vista: 'normal' | 'detalle' = 'normal';
  trabajos: Trabajo[] = [];
  cargando = false;

  mostrarModal = false;
  editando = false;
  trabajoSeleccionado: Trabajo | null = null;
  form: TrabajoCreate = { nombre: '' };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.cargarTrabajos();
  }

  cambiarVista(v: unknown) {
    this.vista = v === 'detalle' ? 'detalle' : 'normal';
  }

  cargarTrabajos() {
    this.cargando = true;
    this.api.getTrabajos().subscribe({
      next: (data) => {
        this.trabajos = Array.isArray(data) ? data : [];
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando trabajos', err);
        this.cargando = false;
        alert('Error al cargar trabajos');
      }
    });
  }

  abrirCrear() {
    this.editando = false;
    this.trabajoSeleccionado = null;
    this.form = { nombre: '' };
    this.mostrarModal = true;
  }

  abrirEditar(t: Trabajo) {
    this.editando = true;
    this.trabajoSeleccionado = t;
    this.form = { nombre: t.Nombre || '' };
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  guardar() {
    if (!this.form.nombre) {
      alert('Nombre es obligatorio');
      return;
    }
    if (this.editando && this.trabajoSeleccionado) {
      this.api.actualizarTrabajo(this.trabajoSeleccionado.IdTrabajo, this.form).subscribe({
        next: () => {
          this.cerrarModal();
          this.cargarTrabajos();
        },
        error: (err) => {
          console.error('Error actualizando trabajo', err);
          alert('Error al actualizar trabajo');
        }
      });
    } else {
      this.api.crearTrabajo(this.form).subscribe({
        next: () => {
          this.cerrarModal();
          this.cargarTrabajos();
        },
        error: (err) => {
          console.error('Error creando trabajo', err);
          alert('Error al crear trabajo');
        }
      });
    }
  }

  eliminar(t: Trabajo) {
    const ok = confirm(`¿Eliminar trabajo ${t.Nombre}?`);
    if (!ok) return;
    this.api.eliminarTrabajo(t.IdTrabajo).subscribe({
      next: () => this.cargarTrabajos(),
      error: (err) => {
        console.error('Error eliminando trabajo', err);
        alert('Error al eliminar trabajo');
      }
    });
  }

}
