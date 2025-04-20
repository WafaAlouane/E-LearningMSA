import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Course, CourseSearchParams } from '../../../models/course.model';
import { CourseService } from '../../../services/course.service';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, SpinnerComponent],
  template: `
    <div class="container">
      <div class="header">
        <h1>Course List</h1>
        <div class="actions">
          <a routerLink="/courses/new" class="btn btn-primary">Add New Course</a>
        </div>
      </div>
      
      <div class="search-panel">
        <h2>Search Courses</h2>
        <div class="search-form">
          <div class="form-group">
            <label for="title">Title</label>
            <input type="text" id="title" [(ngModel)]="searchParams.title" class="form-control">
          </div>
          <div class="form-group">
            <label for="instructor">Instructor</label>
            <input type="text" id="instructor" [(ngModel)]="searchParams.instructor" class="form-control">
          </div>
          <div class="form-group">
            <label for="duration">Duration (hours)</label>
            <input type="number" id="duration" [(ngModel)]="searchParams.duration" class="form-control">
          </div>
          <div class="form-group">
            <label for="price">Max Price</label>
            <input type="number" id="price" [(ngModel)]="searchParams.price" class="form-control">
          </div>
          <div class="form-buttons">
            <button (click)="searchCourses()" class="btn btn-primary">Search</button>
            <button (click)="resetSearch()" class="btn btn-secondary">Reset</button>
          </div>
        </div>
      </div>

      <div *ngIf="loading" class="spinner-container">
        <app-spinner></app-spinner>
      </div>

      <div *ngIf="!loading" class="courses-grid">
        <div *ngIf="courses.length === 0" class="no-courses">
          <p>No courses found. Try different search criteria or add a new course.</p>
          <a routerLink="/courses/new" class="btn btn-primary">Add New Course</a>
        </div>
        
        <div *ngFor="let course of courses" class="course-card" [routerLink]="['/courses', course.id]">
          <h3>{{ course.title }}</h3>
          <p class="instructor">
            <span class="label">Instructor:</span> {{ course.instructor }}
          </p>
          <p class="description">{{ course.description | slice:0:100 }}{{ course.description.length > 100 ? '...' : '' }}</p>
          <div class="course-details">
            <span class="duration">
              <span class="label">Duration:</span> {{ course.duration }} hours
            </span>
            <span class="price" *ngIf="course.price">
    <span class="label">Price:</span> {{ course.price | number:'1.2-2' }}
            </span>
            <span class="price" *ngIf="!course.price">
              <span class="label">Price:</span> Free
            </span>
          </div>
          <div class="card-actions">
            <a [routerLink]="['/courses', course.id]" class="btn btn-text">View Details</a>
            <a [routerLink]="['/courses', course.id, 'edit']" class="btn btn-text" (click)="$event.stopPropagation()">Edit</a>
            <button class="btn btn-danger" (click)="deleteCourse(course.id || 0, $event)">Delete</button>
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

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .header h1 {
      margin: 0;
      color: #333;
    }

    .search-panel {
      background-color: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .search-panel h2 {
      margin-top: 0;
      margin-bottom: 1rem;
      font-size: 1.25rem;
      color: #333;
    }

    .search-form {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #495057;
    }

    .form-control {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 1rem;
    }

    .form-buttons {
      display: flex;
      gap: 0.5rem;
      align-items: flex-end;
    }

    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .course-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      padding: 1.5rem;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
    }

    .course-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.08);
    }

    .course-card h3 {
      margin-top: 0;
      color: #3366cc;
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }

    .instructor {
      color: #6c757d;
      margin-bottom: 0.75rem;
    }

    .description {
      margin-bottom: 1rem;
      color: #495057;
      line-height: 1.5;
    }

    .course-details {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      font-size: 0.95rem;
    }

    .label {
      font-weight: 600;
      color: #495057;
    }

    .card-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }

    .btn {
      display: inline-block;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.3s ease;
      text-align: center;
      border: none;
      cursor: pointer;
    }

    .btn-primary {
      background-color: #3366cc;
      color: white;
    }

    .btn-primary:hover {
      background-color: #2a52a5;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #5a6268;
    }

    .btn-danger {
      background-color: #dc3545;
      color: white;
    }

    .btn-danger:hover {
      background-color: #c82333;
    }

    .btn-text {
      background-color: transparent;
      color: #3366cc;
    }

    .btn-text:hover {
      background-color: rgba(51, 102, 204, 0.1);
    }

    .no-courses {
      grid-column: 1 / -1;
      text-align: center;
      padding: 3rem;
      background-color: #f8f9fa;
      border-radius: 8px;
    }

    .no-courses p {
      margin-bottom: 1.5rem;
      color: #6c757d;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        align-items: flex-start;
      }

      .header h1 {
        margin-bottom: 1rem;
      }

      .search-form {
        grid-template-columns: 1fr;
      }

      .course-details {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  `]
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  loading = true;
  searchParams: CourseSearchParams = {};

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading = true;
    this.courseService.getAllCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching courses', error);
        this.loading = false;
      }
    });
  }

  searchCourses(): void {
    this.loading = true;
    this.courseService.searchCourses(this.searchParams).subscribe({
      next: (data) => {
        this.courses = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching courses', error);
        this.loading = false;
      }
    });
  }

  resetSearch(): void {
    this.searchParams = {};
    this.loadCourses();
  }

  deleteCourse(id: number, event: Event): void {
    event.stopPropagation();
    
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(id).subscribe({
        next: () => {
          this.courses = this.courses.filter(course => course.id !== id);
        },
        error: (error) => {
          console.error('Error deleting course', error);
        }
      });
    }
  }
}