import { currency } from '@/app/common/constants';
import { SelectFormInputDirective } from '@/app/core/directive/select-form-input.directive';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuillEditorComponent } from 'ngx-quill';
import { SubscriptionService } from '../../../../../UserFrontEnd/service/subscription.service';
import { Router } from '@angular/router';

@Component({
  selector: 'course-detail',
  standalone: true,
  imports: [SelectFormInputDirective, QuillEditorComponent, FormsModule],
  templateUrl: './course-detail.component.html',
  styles: ``,
})
export class CourseDetailComponent {
  currency = currency;
  isLoading = false;

  plan = {
    name: '',
    description: '',
    price: 0,
    durationDays: 30
  };

  constructor(
    private subscriptionService: SubscriptionService,
    private router: Router
  ) {}

  isFormValid(): boolean {
    return !!this.plan.name && 
           !!this.plan.description && 
           this.plan.price > 0 && 
           this.plan.durationDays > 0;
  }

  submitPlan(): void {
    if (!this.isFormValid()) return;

    this.isLoading = true;
    
    this.subscriptionService.createPlan(this.plan).subscribe({
      next: () => {
        this.router.navigate(['/admin/course/list']);
      },
      error: (error) => {
        console.error('Error creating plan:', error);
        this.isLoading = false;
      }
    });
  }
}