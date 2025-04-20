import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Joke, Quote, Activity } from '../../models/external-apis.model';
import { ExternalApiService } from '../../services/external-api.service';
import { CourseService } from '../../services/course.service';
import { SpinnerComponent } from '../shared/spinner/spinner.component';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-external',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  template: `
    <div class="container">
      <header class="header">
        <h1>External API Resources</h1>
        <p class="intro">Explore educational resources and fun content from external APIs.</p>
      </header>

      <div class="api-grid">
        <!-- Joke Card -->
        <div class="api-card" [@fadeInOut]="joke">
          <div class="card-header">
            <h2>Random Joke</h2>
            <button (click)="loadJoke()" class="refresh-btn" [class.loading]="jokeLoading" [disabled]="jokeLoading">
              <span class="btn-content" *ngIf="!jokeLoading">
                <span class="btn-icon">↻</span>
                <span>New Joke</span>
              </span>
              <span class="btn-content" *ngIf="jokeLoading">
                <span class="btn-icon spinning">↻</span>
                <span>Loading</span>
              </span>
            </button>
          </div>
          <div *ngIf="jokeLoading" class="spinner-container">
            <app-spinner></app-spinner>
          </div>
          <div *ngIf="!jokeLoading && joke" class="card-content joke-content" [@fadeInOut]>
            <p class="joke-setup">{{ joke.setup }}</p>
            <div class="divider"></div>
            <p class="joke-punchline">{{ joke.punchline }}</p>
          </div>
        </div>

        <!-- Quote Card -->
        <div class="api-card" [@fadeInOut]="quote">
          <div class="card-header">
            <h2>Inspirational Quote</h2>
            <button (click)="loadQuote()" class="refresh-btn accent" [class.loading]="quoteLoading" [disabled]="quoteLoading">
              <span class="btn-content" *ngIf="!quoteLoading">
                <span class="btn-icon">↻</span>
                <span>New Quote</span>
              </span>
              <span class="btn-content" *ngIf="quoteLoading">
                <span class="btn-icon spinning">↻</span>
                <span>Loading</span>
              </span>
            </button>
          </div>
          <div *ngIf="quoteLoading" class="spinner-container">
            <app-spinner></app-spinner>
          </div>
          <div *ngIf="!quoteLoading && quote" class="card-content quote-content" [@fadeInOut]>
            <blockquote>
              <p>"{{ quote.q }}"</p>
              <footer>― <span class="author">{{ quote.a }}</span></footer>
            </blockquote>
          </div>
        </div>

        <!-- Activity Card -->
        <div class="api-card" [@fadeInOut]="activity">
          <div class="card-header">
            <h2>Random Activity</h2>
            <button (click)="loadActivity()" class="refresh-btn success" [class.loading]="activityLoading" [disabled]="activityLoading">
              <span class="btn-content" *ngIf="!activityLoading">
                <span class="btn-icon">↻</span>
                <span>New Activity</span>
              </span>
              <span class="btn-content" *ngIf="activityLoading">
                <span class="btn-icon spinning">↻</span>
                <span>Loading</span>
              </span>
            </button>
          </div>
          <div *ngIf="activityLoading" class="spinner-container">
            <app-spinner></app-spinner>
          </div>
          <div *ngIf="!activityLoading && activity" class="card-content activity-content" [@fadeInOut]>
            <h3 class="activity-title">{{ activity.activity }}</h3>
            <div class="activity-details">
              <div class="detail-item">
                <span class="label">Type</span>
                <span class="badge">{{ activity.type }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Participants</span>
                <span class="value">{{ activity.participants }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Price</span>
                <span class="price-tag" [class]="getPriceClass(activity.price)">
                  {{ getPriceRange(activity.price) }}
                </span>
              </div>
              <div class="detail-item" *ngIf="activity.link">
                <span class="label">Link</span>
                <a [href]="activity.link" target="_blank" rel="noopener noreferrer" class="link">
                  Visit Website
                  <span class="link-icon">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Coursera Card -->
        <div class="api-card wide" [@fadeInOut]="courseraCourses">
          <div class="card-header">
            <h2>Coursera Courses</h2>
            <button (click)="loadCourseraCourses()" class="refresh-btn primary" [class.loading]="courseraLoading" [disabled]="courseraLoading">
              <span class="btn-content" *ngIf="!courseraLoading">
                <span class="btn-icon">↻</span>
                <span>Load Courses</span>
              </span>
              <span class="btn-content" *ngIf="courseraLoading">
                <span class="btn-icon spinning">↻</span>
                <span>Loading</span>
              </span>
            </button>
          </div>
          <div *ngIf="courseraLoading" class="spinner-container">
            <app-spinner></app-spinner>
          </div>
          <div *ngIf="!courseraLoading && courseraCourses?.courses" class="card-content courses-content" [@fadeInOut]>
            <div class="courses-grid">
              <div *ngFor="let course of courseraCourses.courses" class="course-card">
                <h3 class="course-title">{{ course.title }}</h3>
                <div class="course-meta">
                  <div class="instructor">
                    <span class="label">Instructor</span>
                    <span class="value">{{ course.instructor }}</span>
                  </div>
                  <div class="rating">
                    <span class="label">Rating</span>
                    <div class="stars">
                      <div class="stars-filled" [style.width.%]="course.rating * 20">★★★★★</div>
                      <div class="stars-empty">★★★★★</div>
                    </div>
                    <span class="rating-value">{{ course.rating }}</span>
                  </div>
                  <div class="students">
                    <span class="label">Students</span>
                    <span class="value">{{ course.students.toLocaleString() }}</span>
                  </div>
                </div>
                <p class="course-description">{{ course.description }}</p>
                <button class="view-course-btn">
                  View Course
                  <span class="btn-icon">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      padding: 2rem 0;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .header {
      text-align: center;
      margin-bottom: 3rem;
    }

    h1 {
      font-size: 2.5rem;
      color: #1a73e8;
      margin-bottom: 1rem;
      font-weight: 700;
    }

    .intro {
      font-size: 1.1rem;
      color: #5f6368;
      max-width: 600px;
      margin: 0 auto;
    }

    .api-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .api-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .api-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
    }

    .wide {
      grid-column: 1 / -1;
    }

    .card-header {
      padding: 1.25rem;
      border-bottom: 1px solid #e1e4e8;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f8f9fa;
    }

    h2 {
      font-size: 1.25rem;
      color: #202124;
      margin: 0;
    }

    .refresh-btn {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      border: none;
      background: #1a73e8;
      color: white;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .refresh-btn:hover {
      background: #1557b0;
    }

    .refresh-btn.loading {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .btn-content {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-icon {
      font-size: 1.1rem;
    }

    .spinning {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .card-content {
      padding: 1.5rem;
    }

    /* Joke styles */
    .joke-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .joke-setup {
      font-size: 1.1rem;
      color: #202124;
    }

    .divider {
      height: 2px;
      background: linear-gradient(to right, #e1e4e8, transparent);
      margin: 0.5rem 0;
    }

    .joke-punchline {
      font-size: 1.2rem;
      color: #1a73e8;
      font-weight: 500;
    }

    /* Quote styles */
    .quote-content blockquote {
      border-left: 4px solid #1a73e8;
      padding-left: 1rem;
      margin: 0;
    }

    blockquote p {
      font-size: 1.2rem;
      color: #202124;
      font-style: italic;
      margin-bottom: 1rem;
    }

    blockquote footer {
      color: #5f6368;
    }

    .author {
      color: #1a73e8;
      font-weight: 500;
    }

    /* Activity styles */
    .activity-title {
      font-size: 1.3rem;
      color: #202124;
      margin-bottom: 1.5rem;
    }

    .activity-details {
      display: grid;
      gap: 1rem;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .label {
      color: #5f6368;
      font-weight: 500;
      min-width: 100px;
    }

    .badge {
      background: #e8f0fe;
      color: #1a73e8;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.9rem;
    }

    .price-tag {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.9rem;
    }

    .price-free { background: #e6f4ea; color: #137333; }
    .price-low { background: #e8f0fe; color: #1a73e8; }
    .price-medium { background: #fef7e0; color: #ea8600; }
    .price-high { background: #fce8e6; color: #c5221f; }

    .link {
      color: #1a73e8;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .link:hover {
      text-decoration: underline;
    }

    .link-icon {
      font-size: 1.1rem;
      transition: transform 0.2s ease;
    }

    .link:hover .link-icon {
      transform: translateX(4px);
    }

    /* Coursera styles */
    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .course-card {
      padding: 1.25rem;
      border: 1px solid #e1e4e8;
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .course-card:hover {
      border-color: #1a73e8;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .course-title {
      font-size: 1.1rem;
      color: #202124;
      margin-bottom: 1rem;
    }

    .course-meta {
      display: grid;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .stars {
      position: relative;
      display: inline-block;
      color: #dadce0;
      font-size: 1.1rem;
    }

    .stars-filled {
      position: absolute;
      top: 0;
      left: 0;
      color: #fbbc04;
      overflow: hidden;
      white-space: nowrap;
    }

    .course-description {
      color: #5f6368;
      margin-bottom: 1.25rem;
      line-height: 1.5;
    }

    .view-course-btn {
      background: #1a73e8;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s ease;
    }

    .view-course-btn:hover {
      background: #1557b0;
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      .api-grid {
        grid-template-columns: 1fr;
      }

      .card-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .refresh-btn {
        width: 100%;
        justify-content: center;
      }
    }
  `],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ExternalComponent implements OnInit {
  joke: Joke | null = null;
  quote: Quote | null = null;
  activity: Activity | null = null;
  courseraCourses: any = null;

  jokeLoading = false;
  quoteLoading = false;
  activityLoading = false;
  courseraLoading = false;

  constructor(
    private externalApiService: ExternalApiService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.loadJoke();
    this.loadQuote();
    this.loadActivity();
  }

  loadJoke(): void {
    this.jokeLoading = true;
    this.externalApiService.getRandomJoke().subscribe({
      next: (data) => {
        this.joke = data;
        this.jokeLoading = false;
      },
      error: (error) => {
        console.error('Error loading joke', error);
        this.jokeLoading = false;
      }
    });
  }

  loadQuote(): void {
    this.quoteLoading = true;
    this.externalApiService.getStudyQuote().subscribe({
      next: (data) => {
        this.quote = data[0];
        this.quoteLoading = false;
      },
      error: (error) => {
        console.error('Error loading quote', error);
        this.quoteLoading = false;
      }
    });
  }

  loadActivity(): void {
    this.activityLoading = true;
    this.externalApiService.getRandomActivity().subscribe({
      next: (data) => {
        this.activity = data;
        this.activityLoading = false;
      },
      error: (error) => {
        console.error('Error loading activity', error);
        this.activityLoading = false;
      }
    });
  }

  loadCourseraCourses(): void {
    this.courseraLoading = true;
    this.courseService.getCourseraCourses().subscribe({
      next: (data) => {
        this.courseraCourses = data;
        this.courseraLoading = false;
      },
      error: (error) => {
        console.error('Error loading Coursera courses', error);
        this.courseraLoading = false;
      }
    });
  }

  getPriceRange(price: number): string {
    if (price === 0) return 'Free';
    if (price < 0.3) return 'Low';
    if (price < 0.6) return 'Medium';
    return 'High';
  }

  getPriceClass(price: number): string {
    if (price === 0) return 'price-free';
    if (price < 0.3) return 'price-low';
    if (price < 0.6) return 'price-medium';
    return 'price-high';
  }
}