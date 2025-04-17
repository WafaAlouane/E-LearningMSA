import { currency, currentYear } from '@/app/common/constants';
import { Component, OnInit } from '@angular/core';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import aos from 'aos';
import { SubscriptionService, UserSubscription } from '../../../UserFrontEnd/service/subscription.service';
import { AuthService } from '../../../UserFrontEnd/service/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [NgbProgressbarModule, CommonModule, DatePipe],
  templateUrl: './subscription.component.html',
  styles: ``,
})
export class SubscriptionComponent implements OnInit {
  currency = currency;
  currentYear = currentYear;
  subscription: UserSubscription | null = null;
  loading = true;

  constructor(
    private subscriptionService: SubscriptionService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    aos.init();
    this.loadUserSubscription();
  }

  loadUserSubscription(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.snackBar.open('Please log in to view subscription', 'Close', { duration: 3000 });
      this.loading = false;
      return;
    }

    this.subscriptionService.getUserSubscriptions(userId, true).subscribe({
      next: (subscriptions) => {
        if (subscriptions.length > 0) {
          this.subscription = subscriptions[0]; // Prend le premier abonnement actif
        }
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error loading subscription', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  toggleAutoRenew(): void {
    if (!this.subscription) return;

    this.subscriptionService.updateAutoRenew(
      this.subscription.id, 
      !this.subscription.autoRenew
    ).subscribe({
      next: (updatedSubscription) => {
        if (this.subscription) {
          this.subscription.autoRenew = updatedSubscription.autoRenew;
        }
        this.snackBar.open('Auto-renew updated successfully', 'Close', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Error updating auto-renew', 'Close', { duration: 3000 });
      }
    });
  }

  cancelSubscription(): void {
    if (!this.subscription) return;

    this.subscriptionService.cancelSubscription(this.subscription.id).subscribe({
      next: () => {
        this.snackBar.open('Subscription cancelled successfully', 'Close', { duration: 3000 });
        this.loadUserSubscription();
      },
      error: () => {
        this.snackBar.open('Error cancelling subscription', 'Close', { duration: 3000 });
      }
    });
  }
}