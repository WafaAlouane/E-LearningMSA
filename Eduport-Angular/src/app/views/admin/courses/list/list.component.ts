import { Component, OnInit } from '@angular/core'
import { SubscriptionService, SubscriptionPlan } from '../../../../UserFrontEnd/service/subscription.service'
import { RouterLink } from '@angular/router'
import { SelectFormInputDirective } from '@/app/core/directive/select-form-input.directive'
import { FormsModule } from '@angular/forms'
import { CommonModule, CurrencyPipe } from '@angular/common'
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
  selector: 'app-plan-list',
  standalone: true,
  imports: [
    RouterLink,
    SelectFormInputDirective,
    FormsModule,
    CommonModule,
    CurrencyPipe
  ],
  templateUrl: './list.component.html',
  styles: ``,
})
export class ListComponent implements OnInit {
  plans: SubscriptionPlan[] = []
  filteredPlans: SubscriptionPlan[] = []
  searchQuery = ''
  sortOption = ''
  currency = 'USD' // Ou importez depuis vos constantes
  loading = true

  constructor(
    private subscriptionService: SubscriptionService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPlans()
  }

  loadPlans(): void {
    this.subscriptionService.getPlans().subscribe({
      next: (plans) => {
        this.plans = plans
        this.filteredPlans = [...plans]
        this.loading = false
      },
      error: (error) => {
        this.snackBar.open('Error loading plans', 'Close', { duration: 3000 })
        this.loading = false
      }
    })
  }

  filterPlans(): void {
    if (!this.searchQuery) {
      this.filteredPlans = [...this.plans]
    } else {
      const query = this.searchQuery.toLowerCase()
      this.filteredPlans = this.plans.filter(plan => 
        plan.name.toLowerCase().includes(query) || 
        plan.description.toLowerCase().includes(query)
      )
    }
    this.sortPlans()
  }

  sortPlans(): void {
    if (!this.sortOption) return

    this.filteredPlans = [...this.filteredPlans].sort((a, b) => {
      switch (this.sortOption) {
        case 'price_asc': return a.price - b.price
        case 'price_desc': return b.price - a.price
        case 'name_asc': return a.name.localeCompare(b.name)
        case 'name_desc': return b.name.localeCompare(a.name)
        default: return 0
      }
    })
  }

  deletePlan(planId: number): void {
    if (confirm('Are you sure you want to delete this plan?')) {
      // Implémentez la suppression dans votre service si nécessaire
      this.snackBar.open('Delete functionality to be implemented', 'Close', { duration: 3000 })
      // Exemple:
      // this.subscriptionService.deletePlan(planId).subscribe({
      //   next: () => {
      //     this.snackBar.open('Plan deleted successfully', 'Close', { duration: 3000 })
      //     this.loadPlans()
      //   },
      //   error: () => {
      //     this.snackBar.open('Error deleting plan', 'Close', { duration: 3000 })
      //   }
      // })
    }
  }
}