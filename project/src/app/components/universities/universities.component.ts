import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { University } from '../../models/university.model';
import { ExternalApiService } from '../../services/external-api.service';
import { SpinnerComponent } from '../shared/spinner/spinner.component';

@Component({
  selector: 'app-universities',
  standalone: true,
  imports: [CommonModule, FormsModule, SpinnerComponent],
  template: `
    <div class="container">
      <h1>University Search</h1>
      <p class="intro">Search for universities worldwide by name or location.</p>

      <div class="search-box">
        <input 
          type="text" 
          [(ngModel)]="searchQuery" 
          placeholder="Enter university name..." 
          class="search-input"
          (keyup.enter)="searchUniversities()"
        >
        <button (click)="searchUniversities()" class="search-button" [disabled]="loading || !searchQuery">
          <span *ngIf="!loading">Search</span>
          <span *ngIf="loading">Searching...</span>
        </button>
      </div>

      <div *ngIf="loading" class="spinner-container">
        <app-spinner></app-spinner>
      </div>

      <div *ngIf="!loading && searched && universities.length === 0" class="no-results">
        <p>No universities found matching "{{ lastSearchQuery }}". Try a different search term.</p>
      </div>

      <div *ngIf="!loading && universities.length > 0" class="results-container">
        <h2>Results for "{{ lastSearchQuery }}"</h2>
        <p class="results-count">Found {{ universities.length }} universities</p>

        <div class="university-grid">
          <div *ngFor="let university of universities" class="university-card">
            <h3>{{ university.name }}</h3>
            <div class="university-details">
              <p>
                <span class="label">Country:</span>
                <span class="value">{{ university.country }}</span>
              </p>
              <p *ngIf="university.state_province">
                <span class="label">State/Province:</span>
                <span class="value">{{ university.state_province }}</span>
              </p>
            </div>
            <div class="university-links">
              <h4>Websites:</h4>
              <ul>
                <li *ngFor="let webpage of university.web_pages">
                  <a [href]="webpage" target="_blank" rel="noopener noreferrer">{{ webpage }}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    h1 {
      margin-bottom: 0.5rem;
      color: #333;
    }

    .intro {
      color: #6c757d;
      margin-bottom: 2rem;
    }

    .search-box {
      display: flex;
      margin-bottom: 2rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      border-radius: 8px;
      overflow: hidden;
    }

    .search-input {
      flex: 1;
      padding: 1rem;
      border: none;
      font-size: 1rem;
    }

    .search-input:focus {
      outline: none;
    }

    .search-button {
      padding: 1rem 2rem;
      background-color: #3366cc;
      color: white;
      border: none;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .search-button:hover:not(:disabled) {
      background-color: #2a52a5;
    }

    .search-button:disabled {
      background-color: #a1b9e5;
      cursor: not-allowed;
    }

    .no-results {
      background-color: #f8f9fa;
      padding: 2rem;
      border-radius: 8px;
      text-align: center;
      color: #6c757d;
    }

    .results-container h2 {
      margin-bottom: 0.5rem;
      color: #333;
    }

    .results-count {
      color: #6c757d;
      margin-bottom: 1.5rem;
    }

    .university-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .university-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      padding: 1.5rem;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .university-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.08);
    }

    .university-card h3 {
      color: #3366cc;
      margin-top: 0;
      margin-bottom: 1rem;
      font-size: 1.25rem;
    }

    .university-details {
      margin-bottom: 1.5rem;
    }

    .label {
      font-weight: 600;
      color: #495057;
      margin-right: 0.25rem;
    }

    .university-links h4 {
      font-size: 1rem;
      color: #495057;
      margin-bottom: 0.5rem;
    }

    .university-links ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .university-links li {
      margin-bottom: 0.25rem;
    }

    .university-links a {
      color: #3366cc;
      text-decoration: none;
      word-break: break-all;
    }

    .university-links a:hover {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .search-box {
        flex-direction: column;
      }

      .search-button {
        padding: 0.75rem;
      }
    }
  `]
})
export class UniversitiesComponent {
  searchQuery = '';
  lastSearchQuery = '';
  universities: University[] = [];
  loading = false;
  searched = false;

  constructor(private externalApiService: ExternalApiService) {}

  searchUniversities(): void {
    if (!this.searchQuery.trim() || this.loading) return;
    
    this.loading = true;
    this.lastSearchQuery = this.searchQuery;
    this.searched = true;
    
    this.externalApiService.searchUniversities(this.searchQuery).subscribe({
      next: (data) => {
        this.universities = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching universities', error);
        this.universities = [];
        this.loading = false;
      }
    });
  }
}