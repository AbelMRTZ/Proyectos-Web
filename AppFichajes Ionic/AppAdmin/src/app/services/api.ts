// API para conectar con el backend (AppAdmin)

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  IdUsuario: number;
  Nombre: string;
  Usuario: string;
  Clave?: string;
}

export interface UsuarioCreate {
  nombre: string;
  usuario: string;
  clave: string;
}

export interface Trabajo {
  IdTrabajo: number;
  Nombre: string;
}

export interface TrabajoCreate {
  nombre: string;
}

export interface Fichaje {
  IdFichaje: number;
  IdUsuario: number;
  IdTrabajo: number;
  FechaHoraEntrada: string;
  FechaHoraSalida?: string;
  GeolocalizacionLatitud?: number;
  GeolocalizacionLongitud?: number;
  HorasTrabajadas?: number;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:3001';
  private apiKey = 'Test-Key';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey,
    });
  }

  // Usuarios
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/usuarios`, {
      headers: this.getHeaders(),
    });
  }

  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/usuarios/${id}`, {
      headers: this.getHeaders(),
    });
  }

  crearUsuario(data: UsuarioCreate): Observable<any> {
    return this.http.post(`${this.baseUrl}/usuarios`, data, {
      headers: this.getHeaders(),
    });
  }

  actualizarUsuario(id: number, data: UsuarioCreate): Observable<any> {
    return this.http.put(`${this.baseUrl}/usuarios/${id}`, data, {
      headers: this.getHeaders(),
    });
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/usuarios/${id}`, {
      headers: this.getHeaders(),
    });
  }

  // Trabajos
  getTrabajos(): Observable<Trabajo[]> {
    return this.http.get<Trabajo[]>(`${this.baseUrl}/trabajos`, {
      headers: this.getHeaders(),
    });
  }

  getTrabajo(id: number): Observable<Trabajo> {
    return this.http.get<Trabajo>(`${this.baseUrl}/trabajos/${id}`, {
      headers: this.getHeaders(),
    });
  }

  crearTrabajo(data: TrabajoCreate): Observable<any> {
    // Enviar ambos keys para máxima compatibilidad (Nombre y nombre)
    return this.http.post(`${this.baseUrl}/trabajos`, { Nombre: data.nombre, nombre: data.nombre }, {
      headers: this.getHeaders(),
    });
  }

  actualizarTrabajo(id: number, data: TrabajoCreate): Observable<any> {
    // Solo requiere Nombre; se mandan ambos keys por robustez
    return this.http.put(`${this.baseUrl}/trabajos/${id}`, { Nombre: data.nombre, nombre: data.nombre }, {
      headers: this.getHeaders(),
    });
  }

  eliminarTrabajo(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/trabajos/${id}`, {
      headers: this.getHeaders(),
    });
  }

  // Fichajes
  getFichajes(params?: { idUsuario?: number; desde?: string; hasta?: string }): Observable<Fichaje[]> {
    let httpParams = new HttpParams();
    if (params?.idUsuario != null) httpParams = httpParams.set('idUsuario', String(params.idUsuario));
    if (params?.desde) httpParams = httpParams.set('desde', params.desde);
    if (params?.hasta) httpParams = httpParams.set('hasta', params.hasta);
    return this.http.get<Fichaje[]>(`${this.baseUrl}/fichajes`, {
      headers: this.getHeaders(),
      params: httpParams,
    });
  }

  getFichajesRango(params: { desde: string; hasta: string; idUsuario?: number }): Observable<Fichaje[]> {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('desde', params.desde).set('hasta', params.hasta);
    if (params.idUsuario != null) httpParams = httpParams.set('IdUsuario', String(params.idUsuario));
    return this.http.get<Fichaje[]>(`${this.baseUrl}/fichajes/rango`, {
      headers: this.getHeaders(),
      params: httpParams,
    });
  }

  getFichaje(id: number): Observable<Fichaje> {
    return this.http.get<Fichaje>(`${this.baseUrl}/fichajes/${id}`, {
      headers: this.getHeaders()
    });
  }
}
