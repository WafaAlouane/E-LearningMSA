import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <footer class="app-footer">
      <div class="container">
        <p>&copy; {{ currentYear }} Course Manager. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    .app-footer {
      background-color: #f8f9fa;
      color: #6c757d;
      padding: 1.5rem 0;
      margin-top: 3rem;
      border-top: 1px solid #e9ecef;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      text-align: center;
    }

    p {
      margin: 0;
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}