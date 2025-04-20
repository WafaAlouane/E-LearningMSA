import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="hero">
      <div class="container">
        <h1>Welcome to Course Manager</h1>
        <p>Easily manage and discover educational courses through our platform</p>
        <div class="cta-buttons">
          <a routerLink="/courses" class="btn btn-primary">View Courses</a>
          <a routerLink="/courses/new" class="btn btn-secondary">Add New Course</a>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="container">
        <h2>Key Features</h2>
        <div class="feature-grid">
          <div class="feature-card">
            <h3>Course Management</h3>
            <p>Create, update, and manage your educational courses in one place.</p>
          </div>
          <div class="feature-card">
            <h3>Advanced Search</h3>
            <p>Easily find courses by title, instructor, duration, or price.</p>
          </div>
          <div class="feature-card">
            <h3>Statistics & Analytics</h3>
            <p>Get valuable insights about your course portfolio with detailed statistics.</p>
          </div>
          <div class="feature-card">
            <h3>External Resources</h3>
            <p>Access courses from Coursera and discover universities worldwide.</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      background: linear-gradient(135deg, #3366cc, #1a4080);
      color: white;
      padding: 4rem 0;
      text-align: center;
    }

    .hero h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      font-weight: 700;
      animation: fadeInDown 0.8s ease;
    }

    .hero p {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
      opacity: 0.9;
      animation: fadeInUp 0.8s ease;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .cta-buttons {
      display: flex;
      justify-content: center;
      gap: 1rem;
      animation: fadeIn 1s ease;
    }

    .btn {
      display: inline-block;
      padding: 0.8rem 1.5rem;
      border-radius: 4px;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background-color: #28a745;
      color: white;
    }

    .btn-primary:hover {
      background-color: #218838;
      transform: translateY(-2px);
    }

    .btn-secondary {
      background-color: transparent;
      color: white;
      border: 2px solid white;
    }

    .btn-secondary:hover {
      background-color: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }

    .features {
      padding: 4rem 0;
      background-color: #f8f9fa;
    }

    .features h2 {
      text-align: center;
      margin-bottom: 3rem;
      color: #333;
      font-weight: 600;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .feature-card {
      background-color: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
    }

    .feature-card h3 {
      color: #3366cc;
      margin-bottom: 0.75rem;
      font-weight: 600;
    }

    .feature-card p {
      color: #6c757d;
      line-height: 1.6;
    }

    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @media (max-width: 768px) {
      .hero h1 {
        font-size: 2rem;
      }

      .hero p {
        font-size: 1rem;
      }

      .cta-buttons {
        flex-direction: column;
        align-items: center;
      }

      .btn {
        width: 100%;
        max-width: 300px;
        margin-bottom: 0.75rem;
      }
    }
  `]
})
export class HomeComponent {}