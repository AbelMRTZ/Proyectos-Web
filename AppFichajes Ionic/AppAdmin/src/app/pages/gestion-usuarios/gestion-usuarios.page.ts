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
import { ApiService, Usuario, UsuarioCreate } from '../../services/api';

@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.page.html',
  styleUrls: ['./gestion-usuarios.page.scss'],
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
export class GestionUsuariosPage implements OnInit {
  vista: 'normal' | 'detalle' = 'normal';
  usuarios: Usuario[] = [];
  cargando = false;

  // Modal y formulario
  mostrarModal = false;
  editando = false;
  usuarioSeleccionado: Usuario | null = null;
  form: UsuarioCreate = { nombre: '', usuario: '', clave: '' };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cambiarVista(v: unknown) {
    this.vista = v === 'detalle' ? 'detalle' : 'normal';
  }

  cargarUsuarios() {
    this.cargando = true;
    this.api.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = Array.isArray(data) ? data : [];
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando usuarios', err);
        this.cargando = false;
        alert('Error al cargar usuarios');
      }
    });
  }

  abrirCrear() {
    this.editando = false;
    this.usuarioSeleccionado = null;
    this.form = { nombre: '', usuario: '', clave: '' };
    this.mostrarModal = true;
  }

  abrirEditar(u: Usuario) {
    this.editando = true;
    this.usuarioSeleccionado = u;
    this.form = { nombre: u.Nombre || '', usuario: u.Usuario || '', clave: u.Clave || '' };
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  guardar() {
    if (!this.form.nombre || !this.form.usuario) {
      alert('Nombre y Usuario son obligatorios');
      return;
    }
    if (this.editando && this.usuarioSeleccionado) {
      this.api.actualizarUsuario(this.usuarioSeleccionado.IdUsuario, this.form).subscribe({
        next: () => {
          this.cerrarModal();
          this.cargarUsuarios();
        },
        error: (err) => {
          console.error('Error actualizando usuario', err);
          alert('Error al actualizar usuario');
        }
      });
    } else {
      this.api.crearUsuario(this.form).subscribe({
        next: () => {
          this.cerrarModal();
          this.cargarUsuarios();
        },
        error: (err) => {
          console.error('Error creando usuario', err);
          alert('Error al crear usuario');
        }
      });
    }
  }

  eliminar(u: Usuario) {
    const ok = confirm(`¿Eliminar usuario ${u.Nombre}?`);
    if (!ok) return;
    this.api.eliminarUsuario(u.IdUsuario).subscribe({
      next: () => this.cargarUsuarios(),
      error: (err) => {
        console.error('Error eliminando usuario', err);
        alert('Error al eliminar usuario');
      }
    });
  }

}
