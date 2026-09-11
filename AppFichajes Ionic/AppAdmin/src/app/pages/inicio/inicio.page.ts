import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, RouterLink]
})
export class InicioPage implements OnInit {

  constructor() { }

  ngOnInit() {
    // Igual que en AppUsuarios: si venimos del portal de login con querystring,
    // guardar el usuario en localStorage para que las páginas siguientes lo usen.
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
          const cleanUrl = window.location.origin + window.location.pathname + window.location.hash;
          history.replaceState({}, '', cleanUrl);
          console.log('Usuario guardado desde querystring en inicio:', uobj);
        }
      }
    } catch (err) {
      console.warn('Error procesando querystring en inicio', err);
    }
  }

}
