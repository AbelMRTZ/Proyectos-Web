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
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonText,
  IonSpinner,
  AlertController,
  NavController,
} from '@ionic/angular/standalone';
import { ApiService } from '../../services/api';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-registrar-fichaje',
  templateUrl: './registrar-fichaje.page.html',
  styleUrls: ['./registrar-fichaje.page.scss'],
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
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonText,
    IonSpinner
  ]
})
export class RegistrarFichajePage implements OnInit {
  fichajeActivo: any = null;
  trabajos: any[] = [];
  trabajoSeleccionado: number | null = null;
  IdUsuario: number | null = null;
  ubicacion:  { lat: number | null; lng: number | null } = { lat: null, lng: null };
  cargando = true;
  obteniendoUbicacion = true;

  constructor(
    private apiService: ApiService,
    private alertController: AlertController,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    // Intentar cargar usuario desde localStorage (guardado por el login)
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (user && user.IdUsuario) {
        this.IdUsuario = user.IdUsuario;
      } else {
        // Si no hay usuario en localStorage, intentar leer parámetros de la URL
        // (utilidad en desarrollo cuando el portal de login redirige con querystring)
        try {
          const params = new URLSearchParams(window.location.search);
          const idParam = params.get('IdUsuario');
          const usuarioParam = params.get('Usuario');
          const nombreParam = params.get('Nombre');
          const permisosParam = params.get('permisos');
          if (idParam) {
            const parsedId = parseInt(idParam, 10);
            if (!Number.isNaN(parsedId)) {
              this.IdUsuario = parsedId;
              const uobj: any = { IdUsuario: parsedId, Usuario: usuarioParam || '', Nombre: nombreParam || '', permisos: permisosParam || '' };
              try { localStorage.setItem('user', JSON.stringify(uobj)); } catch (e) { /* ignore */ }
              console.log('Usuario cargado desde querystring:', uobj);
            }
          } else {
            console.warn('Usuario no autenticado en localStorage ni en querystring');
          }
        } catch (err2) {
          console.warn('Error leyendo usuario de querystring', err2);
        }
      }
    } catch (err) {
      console.warn('Error leyendo usuario de localStorage', err);
    }

    await this.obtenerUbicacion();
    this.cargarFichajeActivo();
    this.cargarTrabajos();
  }

  async obtenerUbicacion() {
    this.obteniendoUbicacion = true;
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      this.ubicacion = {
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude
      };
      console.log('Ubicación obtenida:', this.ubicacion);
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
      await this.mostrarAlerta(
        'Ubicación no disponible', 
        'No se pudo obtener la ubicación. El fichaje se registrará sin geolocalización.'
      );
      this.ubicacion = { lat: null, lng: null };
    } finally {
      this.obteniendoUbicacion = false;
    }
  }

  cargarFichajeActivo() {
    this.cargando = true;
    if (typeof this.IdUsuario !== 'number') {
      console.warn('No hay IdUsuario definido, omitiendo carga de fichaje activo');
      this.cargando = false;
      this.fichajeActivo = null;
      return;
    }

    this.apiService.getFichajeActivo(this.IdUsuario as number).subscribe({
      next: (fichaje) => {
        this.fichajeActivo = fichaje; 
        this.cargando = false;
        console.log('Fichaje activo:', this.fichajeActivo);
      },
      error: (error) => {
        console.error('Error cargando fichaje activo:', error);
        this.cargando = false;
        this.mostrarAlerta('Error', 'No se pudo cargar el fichaje activo');
      }
    });
  }

  cargarTrabajos() {
    this.apiService.getTrabajos().subscribe({
      next: (trabajos) => {
        this.trabajos = trabajos;
        console.log('Trabajos cargados:', trabajos);
      },
      error: (error) => {
        console.error('Error cargando trabajos:', error);
        this.mostrarAlerta('Error', 'No se pudieron cargar los trabajos');
      }
    });
  }

  async iniciarFichaje() {
    if (!this.trabajoSeleccionado) {
      await this.mostrarAlerta('Selección requerida', 'Por favor selecciona un trabajo');
      return;
    }

    if (typeof this.IdUsuario !== 'number') {
      await this.mostrarAlerta('No autenticado', 'Debes iniciar sesión antes de fichar');
      return;
    }

    const fichajeData = {
      IdUsuario: this.IdUsuario as number,
      IdTrabajo: this.trabajoSeleccionado,
      GeolocalizacionLatitud: this.ubicacion.lat,
      GeolocalizacionLongitud: this.ubicacion.lng
    };

    console.log('Iniciando fichaje con datos:', fichajeData);

    this.apiService.crearFichaje(fichajeData).subscribe({
      next: async (response) => {
        console.log('Fichaje iniciado:', response);
        await this.mostrarAlerta('Éxito', 'Fichaje iniciado correctamente');
        this.cargarFichajeActivo();
        this.trabajoSeleccionado = null;
      },
      error: async (error) => {
        console.error('ERROR COMPLETO iniciando fichaje:', error);
        console.error('Status:', error.status);
        console.error('Message:', error.message);
        console.error('Error body:', error.error);
        
        let mensajeError = 'No se pudo iniciar el fichaje';
        if (error.status === 0) {
          mensajeError = 'No se puede conectar al servidor. Verifica que la API esté corriendo.';
        } else if (error.error?.error) {
          mensajeError = error.error.error;
        }
        
        await this.mostrarAlerta('Error', mensajeError);
      }
    });
  }

  async finalizarFichaje() {
    if (!this.fichajeActivo) {
      return;
    }

    let ubicacionSalida: { lat: number | null; lng: number | null } = { lat: null, lng: null };
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      ubicacionSalida = {
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude
      };
    } catch (error) {
      console.error('Error obteniendo ubicación para salida:', error);
    }

    const geolocalizacion = {
      GeolocalizacionLatitud: ubicacionSalida.lat,
      GeolocalizacionLongitud: ubicacionSalida.lng
    };

    console.log('Finalizando fichaje:', this.fichajeActivo.IdFichaje, 'con datos:', geolocalizacion);

    this.apiService.actualizarFichaje(this.fichajeActivo.IdFichaje, geolocalizacion).subscribe({
      next: async (response) => {
        console.log('Fichaje finalizado:', response);
        await this.mostrarAlerta('Éxito', 'Fichaje finalizado correctamente');
        this.fichajeActivo = null;
        this.navCtrl.navigateBack('/home');
      },
      error: async (error) => {
        console.error('Error finalizando fichaje:', error);
        await this.mostrarAlerta('Error', 'No se pudo finalizar el fichaje');
      }
    });
  }

  // Función auxiliar para calcular horas trabajadas
  calcularHorasTrabajadas(fechaEntrada: string): number {
    const entrada = new Date(fechaEntrada);
    const salida = new Date();
    const diffMs = salida.getTime() - entrada.getTime();
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
    return diffHoras;
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }

  // Formatear fecha para mostrar
  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Recargar la página
  recargar() {
    this.cargarFichajeActivo();
    this.cargarTrabajos();
    this.obtenerUbicacion();
  }
}