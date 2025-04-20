import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="app-header">
      <div class="container">
        <div class="logo">
          <h1>Course Manager</h1>
        </div>
        <nav class="main-nav">
          <ul>
            <li><a routerLink="/home" routerLinkActive="active">Home</a></li>
            <li><a routerLink="/courses" routerLinkActive="active">Courses</a></li>
            <li><a routerLink="/statistics" routerLinkActive="active">Statistics</a></li>
            <li><a routerLink="/universities" routerLinkActive="active">Universities</a></li>
            <li><a routerLink="/external" routerLinkActive="active">External APIs</a></li>
          </ul>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      background-color: #3366cc;
      color: white;
      padding: 1rem 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .main-nav ul {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .main-nav li {
      margin-left: 1.5rem;
    }

    .main-nav a {
      color: white;
      text-decoration: none;
      font-weight: 500;
      padding: 0.5rem 0;
      position: relative;
      transition: color 0.3s ease;
    }

    .main-nav a::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background-color: white;
      transition: width 0.3s ease;
    }

    .main-nav a:hover::after,
    .main-nav a.active::after {
      width: 100%;
    }

    @media (max-width: 768px) {
      .container {
        flex-direction: column;
      }

      .logo {
        margin-bottom: 1rem;
      }

      .main-nav ul {
        flex-wrap: wrap;
        justify-content: center;
      }

      .main-nav li {
        margin: 0 0.75rem;
      }
    }
  `]
})
export class HeaderComponent {}