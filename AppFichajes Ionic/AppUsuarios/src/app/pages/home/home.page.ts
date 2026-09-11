import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle
  ]
})
export class HomePage implements OnInit {

  constructor(private navCtrl: NavController) {}

  ngOnInit() {
    // Si la app fue abierta con querystring desde el portal de login,
    // registrar el usuario en localStorage para que otras páginas lo usen.
    try {
      const params = new URLSearchParams(window.location.search);
      const idParam = params.get('IdUsuario');
      if (idParam) {
        const parsedId = parseInt(idParam, 10);
        if (!Number.isNaN(parsedId)) {
          const usuarioParam = params.get('Usuario') || '';
          const nombreParam = params.get('Nombre') || '';
          const permisosParam = params.get('permisos') || '';
          const uobj: any = { IdUsuario: parsedId, Usuario: usuarioParam, Nombre: nombreParam, permisos: permisosParam };
          try { localStorage.setItem('user', JSON.stringify(uobj)); } catch (e) { /* ignore */ }
          // limpiar la querystring para no exponer datos en la barra
          const cleanUrl = window.location.origin + window.location.pathname + window.location.hash;
          history.replaceState({}, '', cleanUrl);
          console.log('Usuario guardado desde querystring en home:', uobj);
        }
      }
    } catch (err) {
      console.warn('Error procesando querystring en home', err);
    }
  }

  irARegistrarFichaje() {
    this.navCtrl.navigateForward('/registrar-fichaje');
  }

  irAConsultaFichajes() {
    this.navCtrl.navigateForward('/consulta-fichajes');
  }
}