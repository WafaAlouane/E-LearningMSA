import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseStatistics } from '../../models/course.model';
import { CourseService } from '../../services/course.service';
import { SpinnerComponent } from '../shared/spinner/spinner.component';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  template: `
    <div class="container">
      <h1>Course Statistics</h1>

      <div *ngIf="loading" class="spinner-container">
        <app-spinner></app-spinner>
      </div>

      <div *ngIf="!loading && statistics" class="statistics-container">
        <div class="stats-cards">
          <div class="stats-card">
            <div class="card-title">Total Courses</div>
            <div class="card-value">{{ statistics.totalCourses }}</div>
          </div>
          <div class="stats-card">
            <div class="card-title">Average Price</div>
<div class="card-value">{{ statistics.averagePrice | number:'1.2-2' }}</div>
          </div>
          <div class="stats-card">
            <div class="card-title">Average Duration</div>
            <div class="card-value">{{ statistics.averageDuration.toFixed(1) }} hours</div>
          </div>
          <div class="stats-card">
            <div class="card-title">Paid Courses</div>
            <div class="card-value">{{ statistics.coursesWithPrice }}</div>
          </div>
        </div>

        <div class="instructor-stats">
          <h2>Courses by Instructor</h2>
          <div class="instructor-chart">
            <div *ngFor="let instructor of instructors" class="chart-bar">
              <div class="bar-label">{{ instructor }}</div>
              <div class="bar-container">
                <div 
                  class="bar" 
                  [style.width.%]="getPercentage(statistics.instructorCount[instructor])"
                  [style.background-color]="getBarColor(instructor)"
                >
                  {{ statistics.instructorCount[instructor] }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && !statistics" class="no-data">
        <p>No statistics available. Please add some courses first.</p>
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
      margin-bottom: 2rem;
      color: #333;
    }

    .statistics-container {
      animation: fadeIn 0.5s ease;
    }

    .stats-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stats-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      padding: 1.5rem;
      text-align: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .stats-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.08);
    }

    .card-title {
      font-size: 1rem;
      color: #6c757d;
      margin-bottom: 0.5rem;
    }

    .card-value {
      font-size: 2rem;
      font-weight: 700;
      color: #3366cc;
    }

    .instructor-stats {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .instructor-stats h2 {
      margin-top: 0;
      margin-bottom: 1.5rem;
      color: #333;
      font-size: 1.5rem;
    }

    .instructor-chart {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .chart-bar {
      display: flex;
      align-items: center;
    }

    .bar-label {
      width: 120px;
      font-weight: 500;
      color: #495057;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .bar-container {
      flex: 1;
      height: 30px;
      background-color: #f8f9fa;
      border-radius: 4px;
      overflow: hidden;
    }

    .bar {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 0 1rem;
      color: white;
      font-weight: 500;
      border-radius: 4px;
      transition: width 0.8s ease-out;
    }

    .no-data {
      text-align: center;
      padding: 3rem;
      background-color: #f8f9fa;
      border-radius: 8px;
    }

    .no-data p {
      color: #6c757d;
      font-size: 1.1rem;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @media (max-width: 768px) {
      .bar-label {
        width: 80px;
      }
    }
  `]
})
export class StatisticsComponent implements OnInit {
  statistics: CourseStatistics | null = null;
  instructors: string[] = [];
  loading = true;
  colors = ['#3366cc', '#dc3545', '#28a745', '#fd7e14', '#6f42c1', '#20c997', '#6c757d', '#e83e8c'];

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.courseService.getCoursesStatistics().subscribe({
      next: (data) => {
        this.statistics = data.statistics;
        this.instructors = Object.keys(this.statistics.instructorCount);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading statistics', error);
        this.loading = false;
      }
    });
  }

  getPercentage(count: number): number {
    if (!this.statistics) return 0;
    return (count / this.statistics.totalCourses) * 100;
  }

  getBarColor(instructor: string): string {
    const index = this.instructors.indexOf(instructor) % this.colors.length;
    return this.colors[index];
  }
}