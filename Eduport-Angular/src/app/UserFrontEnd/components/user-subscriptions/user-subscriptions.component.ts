import { Component, OnInit } from '@angular/core';
import { SubscriptionService, UserSubscription } from '../../service/subscription.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MaterialModule } from '../../../../app/material.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  standalone: true,
  selector: 'app-user-subscriptions',
  templateUrl: './user-subscriptions.component.html',
  styleUrls: ['./user-subscriptions.component.scss'],
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    RouterModule,
    CurrencyPipe,
    DatePipe
  ]
})
export class UserSubscriptionsComponent implements OnInit {
  subscriptions: UserSubscription[] = [];
  activeOnly = true;
  loading = true;
  userId: number | null = null;

  constructor(
    private subscriptionService: SubscriptionService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    if (!this.userId) {
      this.snackBar.open('Please log in to view subscriptions', 'Close', { duration: 3000 });
      return;
    }
    this.loadSubscriptions();
  }

  loadSubscriptions(): void {
    if (!this.userId) return;

    this.loading = true;
    this.subscriptionService.getUserSubscriptions(this.userId, this.activeOnly).subscribe({
      next: (subscriptions) => {
        this.subscriptions = subscriptions;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error loading subscriptions', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  toggleActiveOnly(): void {
    this.activeOnly = !this.activeOnly;
    this.loadSubscriptions();
  }

  cancelSubscription(subscriptionId: number): void {
    this.subscriptionService.cancelSubscription(subscriptionId).subscribe({
      next: () => {
        this.snackBar.open('Subscription cancelled successfully', 'Close', { duration: 3000 });
        this.loadSubscriptions();
      },
      error: () => {
        this.snackBar.open('Error cancelling subscription', 'Close', { duration: 3000 });
      }
    });
  }

  toggleAutoRenew(subscription: UserSubscription): void {
    this.subscriptionService.updateAutoRenew(subscription.id, !subscription.autoRenew).subscribe({
      next: (updatedSubscription) => {
        subscription.autoRenew = updatedSubscription.autoRenew;
        this.snackBar.open('Auto-renew updated successfully', 'Close', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Error updating auto-renew', 'Close', { duration: 3000 });
      }
    });
  }
}