import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Course } from '../../../models/course.model';
import { CourseService } from '../../../services/course.service';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, SpinnerComponent],
  template: `
    <div class="container">
      <div class="form-header">
        <h1>{{ isEditMode ? 'Edit Course' : 'Create New Course' }}</h1>
        <a routerLink="/courses" class="btn btn-secondary">Back to List</a>
      </div>

      <div *ngIf="loading" class="spinner-container">
        <app-spinner></app-spinner>
      </div>

      <form *ngIf="!loading" [formGroup]="courseForm" (ngSubmit)="submitForm()" class="course-form">
        <div class="form-group">
          <label for="title">Title</label>
          <input type="text" id="title" formControlName="title" class="form-control">
          <div *ngIf="courseForm.get('title')?.invalid && courseForm.get('title')?.touched" class="error-message">
            Title is required.
          </div>
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" formControlName="description" rows="5" class="form-control"></textarea>
          <div *ngIf="courseForm.get('description')?.invalid && courseForm.get('description')?.touched" class="error-message">
            Description is required.
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="instructor">Instructor</label>
            <input type="text" id="instructor" formControlName="instructor" class="form-control">
            <div *ngIf="courseForm.get('instructor')?.invalid && courseForm.get('instructor')?.touched" class="error-message">
              Instructor name is required.
            </div>
          </div>

          <div class="form-group">
            <label for="duration">Duration (hours)</label>
            <input type="number" id="duration" formControlName="duration" class="form-control">
            <div *ngIf="courseForm.get('duration')?.invalid && courseForm.get('duration')?.touched" class="error-message">
              <span *ngIf="courseForm.get('duration')?.errors?.['required']">Duration is required.</span>
              <span *ngIf="courseForm.get('duration')?.errors?.['min']">Duration must be at least 1 hour.</span>
            </div>
          </div>

          <div class="form-group">
            <label for="price">Price ($)</label>
            <input type="number" id="price" formControlName="price" class="form-control">
            <div *ngIf="courseForm.get('price')?.invalid && courseForm.get('price')?.touched" class="error-message">
              <span *ngIf="courseForm.get('price')?.errors?.['min']">Price cannot be negative.</span>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" [disabled]="courseForm.invalid" class="btn btn-primary">
            {{ isEditMode ? 'Update Course' : 'Create Course' }}
          </button>
          <button type="button" (click)="resetForm()" class="btn btn-secondary">Reset</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .form-header h1 {
      color: #333;
      margin: 0;
    }

    .course-form {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      padding: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #495057;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 1rem;
    }

    .form-control:focus {
      border-color: #3366cc;
      outline: none;
      box-shadow: 0 0 0 3px rgba(51, 102, 204, 0.25);
    }

    textarea.form-control {
      resize: vertical;
    }

    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    .btn {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.3s ease;
      text-align: center;
      border: none;
      cursor: pointer;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background-color: #3366cc;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #2a52a5;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: #5a6268;
    }

    @media (max-width: 768px) {
      .form-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .form-header a {
        margin-top: 1rem;
      }

      .form-actions {
        flex-direction: column;
      }

      .btn {
        width: 100%;
      }
    }
  `]
})
export class CourseFormComponent implements OnInit {
  courseForm!: FormGroup;
  isEditMode = false;
  courseId?: number;
  loading = true;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.courseId = +id;
      this.loadCourse(this.courseId);
    } else {
      this.loading = false;
    }
  }

  initForm(): void {
    this.courseForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      instructor: ['', Validators.required],
      duration: [null, [Validators.required, Validators.min(1)]],
      price: [null, Validators.min(0)]
    });
  }

  loadCourse(id: number): void {
    this.courseService.getCourseById(id).subscribe({
      next: (course) => {
        this.courseForm.patchValue({
          title: course.title,
          description: course.description,
          instructor: course.instructor,
          duration: course.duration,
          price: course.price
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading course', error);
        this.loading = false;
        this.router.navigate(['/courses']);
      }
    });
  }

  submitForm(): void {
    if (this.courseForm.invalid) return;

    const courseData: Course = this.courseForm.value;
    
    if (this.isEditMode && this.courseId) {
      this.courseService.updateCourse(this.courseId, courseData).subscribe({
        next: () => {
          this.router.navigate(['/courses', this.courseId]);
        },
        error: (error) => {
          console.error('Error updating course', error);
        }
      });
    } else {
      this.courseService.createCourse(courseData).subscribe({
        next: (newCourse) => {
          this.router.navigate(['/courses', newCourse.id]);
        },
        error: (error) => {
          console.error('Error creating course', error);
        }
      });
    }
  }

  resetForm(): void {
    if (this.isEditMode && this.courseId) {
      this.loadCourse(this.courseId);
    } else {
      this.courseForm.reset();
    }
  }
}