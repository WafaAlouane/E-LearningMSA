import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found-container">
      <div class="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for doesn't exist or has been moved.</p>
        <a routerLink="/home" class="btn btn-primary">Go to Home</a>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 200px);
      padding: 2rem;
    }

    .not-found-content {
      text-align: center;
      max-width: 500px;
    }

    h1 {
      font-size: 8rem;
      color: #3366cc;
      margin: 0;
      line-height: 1;
    }

    h2 {
      font-size: 2rem;
      color: #333;
      margin-bottom: 1rem;
    }

    p {
      color: #6c757d;
      margin-bottom: 2rem;
      font-size: 1.1rem;
    }

    .btn {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.3s ease;
      background-color: #3366cc;
      color: white;
    }

    .btn:hover {
      background-color: #2a52a5;
      transform: translateY(-2px);
    }
  `]
})
export class NotFoundComponent {}