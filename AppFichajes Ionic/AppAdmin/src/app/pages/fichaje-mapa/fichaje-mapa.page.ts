import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';
import { ApiService, Fichaje } from '../../services/api';

@Component({
  selector: 'app-fichaje-mapa',
  templateUrl: './fichaje-mapa.page.html',
  styleUrls: ['./fichaje-mapa.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class FichajeMapaPage implements OnInit {

  private map?: L.Map;
  fichaje?: Fichaje | null;

  constructor(private route: ActivatedRoute, private api: ApiService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) this.loadFichaje(Number(id));
    });
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private loadFichaje(id: number) {
    this.api.getFichaje(id).subscribe({
      next: f => {
        this.fichaje = f;
        setTimeout(() => this.initMap(), 50);
      },
      error: err => {
        console.error('Error cargando fichaje:', err);
        alert('No se pudo cargar el fichaje');
      }
    });
  }

  private initMap() {
    if (!this.fichaje) return;
    const lat = Number(this.fichaje.GeolocalizacionLatitud);
    const lng = Number(this.fichaje.GeolocalizacionLongitud);
    if (!lat || !lng) {
      alert('No hay geolocalización para este fichaje');
      return;
    }

    // Fix default icon URLs to CDN to avoid bundler image issues
    (L.Icon.Default as any).mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
    });

    // Remove previous map if any
    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('map').setView([lat, lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    const icon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    L.marker([lat, lng], { icon }).addTo(this.map)
      .bindPopup(`Fichaje: ${this.fichaje.IdFichaje}`)
      .openPopup();
  }

}
