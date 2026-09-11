// API para conectar con el backend

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3001';
  private apiKey = 'Test-Key'; // Mi api key de prueba

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey
    });
  }
  // Fichajes
  getFichajesHoy(IdUsuario: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/fichajes/hoy?IdUsuario=${IdUsuario}`, { 
      headers: this.getHeaders() 
    });
  }

  getFichajeActivo(IdUsuario: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/fichajes/activo?IdUsuario=${IdUsuario}`, { 
      headers: this.getHeaders() 
    });
  }

  crearFichaje(fichajeData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/fichajes/iniciar`, fichajeData, { 
      headers: this.getHeaders() 
    });
  }

  actualizarFichaje(IdFichaje: number, geolocalizacion: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/fichajes/finalizar/${IdFichaje}`, geolocalizacion, { 
      headers: this.getHeaders() 
    });
  }
  
  // Trabajos
  getTrabajos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/trabajos`, { headers: this.getHeaders() });
  }

  // Posible Login
  login(credenciales: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/usuarios/login`, credenciales, { 
      headers: this.getHeaders() 
    });
  }

  // Apikey
  crearApiKey(): Observable<any> {
    return this.http.post(`${this.baseUrl}/apikey`, {}, { 
      headers: this.getHeaders() 
    });
  }

}
