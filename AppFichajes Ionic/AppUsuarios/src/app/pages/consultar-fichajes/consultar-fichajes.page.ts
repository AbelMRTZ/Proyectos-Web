import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonBackButton, 
  IonButtons,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonSpinner,
  IonText,
  AlertController,
  IonRefresher,
  IonRefresherContent,
  IonItemSliding,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/angular/standalone';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-consulta-fichajes',
  templateUrl: './consultar-fichajes.page.html',
  styleUrls: ['./consultar-fichajes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonBackButton,
    IonButtons,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonSpinner,
    IonText,
    IonRefresher,
    IonRefresherContent,
    IonItemSliding,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
  ]
})
export class ConsultaFichajesPage implements OnInit {
  fichajes: any[] = [];
  cargando = true;
  IdUsuario: number | null = null;

  constructor(
    private apiService: ApiService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.initUsuarioYcargar();
  }

  private initUsuarioYcargar() {
    // Intentar leer usuario desde localStorage
    // Intentar ambas claves: 'usuario' (apps) y 'user' (login portal)
    const uStr = localStorage.getItem('usuario') || localStorage.getItem('user');
    if (uStr) {
      try {
        const u = JSON.parse(uStr);
        if (u && u.IdUsuario != null) {
          this.IdUsuario = Number(u.IdUsuario);
        }
      } catch {}
    }

    // Fallback: leer desde querystring si aún no está
    if (this.IdUsuario == null) {
      const params = new URLSearchParams(window.location.search);
      const idFromQs = params.get('IdUsuario') || params.get('idUsuario');
      if (idFromQs) {
        this.IdUsuario = Number(idFromQs);
        // Si tenemos más datos de usuario en QS, guardarlos en localStorage
        const nombre = params.get('Nombre') || params.get('nombre');
        const usuarioNombre = params.get('Usuario') || params.get('usuario');
        const permisos = params.get('permisos');
        const usr = { IdUsuario: this.IdUsuario, Nombre: nombre, Usuario: usuarioNombre, permisos };
        localStorage.setItem('usuario', JSON.stringify(usr));
        // Limpiar la URL (opcional)
        history.replaceState({}, document.title, window.location.pathname);
      }
    }

    if (this.IdUsuario == null) {
      this.cargando = false;
      this.mostrarAlerta('Usuario no identificado', 'Inicia sesión para consultar tus fichajes.');
      return;
    }

    this.cargarFichajesHoy();
  }

  cargarFichajesHoy() {
    this.cargando = true;
    this.apiService.getFichajesHoy(this.IdUsuario as number).subscribe({
      next: (fichajes) => {
        this.fichajes = fichajes;
        this.cargando = false;
        console.log('Fichajes cargados:', fichajes);
      },
      error: (error) => {
        console.error('Error cargando fichajes:', error);
        this.cargando = false;
        this.mostrarAlerta('Error', 'No se pudieron cargar los fichajes');
      }
    });
  }

  // Formatear fecha para mostrar
  formatearFecha(fecha: string): string {
    if (!fecha) return 'No registrada';
    
    return new Date(fecha).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Formatear geolocalización
  formatearGeolocalizacion(fichaje: any): string {
    if (fichaje.GeolocalizacionLatitud && fichaje.GeolocalizacionLongitud) {
      return `${fichaje.GeolocalizacionLatitud.toFixed(4)}, ${fichaje.GeolocalizacionLongitud.toFixed(4)}`;
    }
    return 'No disponible';
  }

  // Calcular duración del fichaje
  calcularDuracion(fichaje: any): string {
    if (!fichaje.FechaHoraEntrada || !fichaje.FechaHoraSalida) {
      return 'En curso';
    }

    const entrada = new Date(fichaje.FechaHoraEntrada);
    const salida = new Date(fichaje.FechaHoraSalida);
    const diffMs = salida.getTime() - entrada.getTime();
    
    const horas = Math.floor(diffMs / (1000 * 60 * 60));
    const minutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${horas}h ${minutos}m`;
  }

  // Recargar datos
  recargar(event?: any) {
    this.cargarFichajesHoy();
    if (event) {
      event.target.complete();
    }
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }

  // Verificar si un fichaje está activo (sin hora de salida)
  esFichajeActivo(fichaje: any): boolean {
    return !fichaje.FechaHoraSalida;
  }

  // Función para mejorar rendimiento de la lista
  trackByFichaje(index: number, fichaje: any): number {
    return fichaje.IdFichaje || index;
  }

  get fichajesActivos(): number {
    return this.fichajes.filter(f => this.esFichajeActivo(f)).length;
  }

  get fichajesFinalizados(): number {
    return this.fichajes.filter(f => !this.esFichajeActivo(f)).length;
  }
}