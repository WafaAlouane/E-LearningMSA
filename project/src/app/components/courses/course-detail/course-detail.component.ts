import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Course } from '../../../models/course.model';
import { CourseService } from '../../../services/course.service';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, SpinnerComponent],
  template: `
    <div class="container">
      <div *ngIf="loading" class="spinner-container">
        <app-spinner></app-spinner>
      </div>

      <div *ngIf="!loading && course">
        <div class="course-header">
          <h1>{{ course.title }}</h1>
          <div class="actions">
            <a [routerLink]="['/courses', course.id, 'edit']" class="btn btn-primary">Edit Course</a>
            <button (click)="deleteCourse()" class="btn btn-danger">Delete Course</button>
            <a routerLink="/courses" class="btn btn-secondary">Back to List</a>
          </div>
        </div>

        <div class="course-card">
          <div class="course-info">
            <div class="info-item">
              <span class="label">Instructor:</span>
              <span class="value">{{ course.instructor }}</span>
            </div>
            <div class="info-item">
              <span class="label">Duration:</span>
              <span class="value">{{ course.duration }} hours</span>
            </div>
            <div class="info-item" *ngIf="course.price !== undefined && course.price !== null">
              <span class="label">Price:</span>
              <span class="value">{{ course.price | number:'1.2-2' }}</span>
            </div>
            <div class="info-item" *ngIf="course.price === undefined || course.price === null">
              <span class="label">Price:</span>
              <span class="value">Free</span>
            </div>
          </div>

          <div class="course-description">
            <h2>Description</h2>
            <p>{{ course.description }}</p>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && !course" class="not-found">
        <h2>Course Not Found</h2>
        <p>The course you are looking for does not exist or has been removed.</p>
        <a routerLink="/courses" class="btn btn-primary">Back to Courses</a>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .course-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .course-header h1 {
      color: #333;
      margin: 0 0 1rem 0;
      flex: 1;
    }

    .actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .course-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      padding: 2rem;
      margin-bottom: 2rem;
    }

    .course-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #e9ecef;
    }

    .info-item {
      display: flex;
      flex-direction: column;
    }

    .label {
      font-weight: 600;
      color: #495057;
      margin-bottom: 0.25rem;
    }

    .value {
      font-size: 1.25rem;
      color: #333;
    }

    .course-description h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #333;
    }

    .course-description p {
      line-height: 1.6;
      color: #495057;
    }

    .not-found {
      text-align: center;
      padding: 3rem;
      background-color: #f8f9fa;
      border-radius: 8px;
    }

    .not-found h2 {
      margin-bottom: 1rem;
      color: #333;
    }

    .not-found p {
      margin-bottom: 1.5rem;
      color: #6c757d;
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

    @media (max-width: 768px) {
      .course-header {
        flex-direction: column;
      }

      .actions {
        margin-bottom: 1rem;
        width: 100%;
      }

      .btn {
        width: 100%;
      }
    }
  `]
})
export class CourseDetailComponent implements OnInit {
  course: Course | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCourse(+id);
    } else {
      this.loading = false;
    }
  }

  loadCourse(id: number): void {
    this.courseService.getCourseById(id).subscribe({
      next: (data) => {
        this.course = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching course details', error);
        this.loading = false;
      }
    });
  }

  deleteCourse(): void {
    if (!this.course?.id) return;
    
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(this.course.id).subscribe({
        next: () => {
          this.router.navigate(['/courses']);
        },
        error: (error) => {
          console.error('Error deleting course', error);
        }
      });
    }
  }
}