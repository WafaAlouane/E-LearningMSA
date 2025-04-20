import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Partenaire } from '../models/Partenaire';

@Injectable({
  providedIn: 'root',
})
export class PartenairesService {
  private apiUrl = 'http://localhost:8083/api/partenaires'; // 🔥 URL de ton API Spring Boot

  constructor(private http: HttpClient) {}

  /** 🔹 Récupérer tous les partenaires */
  getAllPartenaires(): Observable<Partenaire[]> {
    return this.http.get<Partenaire[]>(`${this.apiUrl}/getAll`);
  }

  /** 🔹 Récupérer un partenaire par ID */
  getPartenaireById(id: number): Observable<Partenaire> {
    return this.http.get<Partenaire>(`${this.apiUrl}/${id}`);
  }

  /** 🔹 Ajouter un partenaire */
  createPartenaire(partenaire: Partenaire): Observable<Partenaire> {
    return this.http.post<Partenaire>(`${this.apiUrl}/create`, partenaire);
  }

  /** 🔹 Modifier un partenaire */
  updatePartenaire(id: number, partenaire: Partenaire): Observable<Partenaire> {
    return this.http.put<Partenaire>(`${this.apiUrl}/update/${id}`, partenaire);
  }

  /** 🔹 Supprimer un partenaire */
  deletePartenaire(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  /** 🔹 Activer/Désactiver un partenaire */
  toggleActivation(id: number, active: boolean): Observable<Partenaire> {
    return this.http.put<Partenaire>(`${this.apiUrl}/activation/${id}?active=${active}`, {});
  }

  /** 🔹 Rechercher un partenaire par nom */
  searchPartenaireByName(name: string): Observable<Partenaire[]> {
    return this.http.get<Partenaire[]>(`${this.apiUrl}/search?name=${name}`);
  }

  /** 🔹 Trier les partenaires */
  getSortedPartenaires(field: string, direction: string): Observable<Partenaire[]> {
    return this.http.get<Partenaire[]>(`${this.apiUrl}/sorted?field=${field}&direction=${direction}`);
  }

  /** 🔹 Paginer les partenaires */
  getPaginatedPartenaires(page: number, size: number): Observable<Partenaire[]> {
    return this.http.get<Partenaire[]>(`${this.apiUrl}/paginated?page=${page}&size=${size}`);
  }

  /** 🔹 Filtrer les partenaires par statut */
  getPartenairesByStatus(active: boolean): Observable<Partenaire[]> {
    return this.http.get<Partenaire[]>(`${this.apiUrl}/filter-by-status?active=${active}`);
  }
}
