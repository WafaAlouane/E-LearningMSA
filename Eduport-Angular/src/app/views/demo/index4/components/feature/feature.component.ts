import { Component, OnInit } from '@angular/core';
import { SubscriptionService, SubscriptionPlan } from '../../../../../UserFrontEnd/service/subscription.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { PaymentFormComponent } from '../../../../../UserFrontEnd/components/payment-form/payment-form.component';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../UserFrontEnd/service/auth.service';

@Component({
  selector: 'index4-feature',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  templateUrl: './feature.component.html'
})
export class FeatureComponent implements OnInit {
  plans: SubscriptionPlan[] = [];
  loading = true;
  currentPlan: SubscriptionPlan | null = null;

  constructor(
    private subscriptionService: SubscriptionService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.subscriptionService.getPlans().subscribe({
      next: (plans) => {
        this.plans = plans;
        this.loading = false;
      },
      error: (err) => {
        this.showError(err.message || 'Erreur lors du chargement des abonnements');
        this.loading = false;
      }
    });
  }

  openPaymentDialog(plan: SubscriptionPlan): void {
    this.currentPlan = plan;

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      this.showError('Veuillez vous connecter');
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      this.showError('ID utilisateur introuvable');
      return;
    }

    const dialogRef = this.dialog.open(PaymentFormComponent, {
      width: '500px',
      data: { plan, userId }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.success) {
        this.showSuccess(result.message || 'Paiement effectué avec succès');
        this.loadPlans(); // Recharger les plans après succès
      } else if (result?.error) {
        this.showPaymentError(result.error);
      }
    });
  }

  private showPaymentError(error: { code: string; message: string; details?: string }): void {
    let action = 'Fermer';
    let duration = 5000;
    let panelClass = 'error-snackbar';
    
    // Personnalisation selon le type d'erreur
    switch(error.code) {
      case 'card_declined':
        action = 'Réessayer';
        duration = 7000;
        break;
      case 'insufficient_funds':
        action = 'Changer de carte';
        duration = 7000;
        break;
      case 'expired_card':
        action = 'Mettre à jour';
        duration = 6000;
        break;
    }

    const message = error.details 
      ? `${error.message} (${error.details})`
      : error.message;

    const snackBarRef = this.snackBar.open(`❌ ${message}`, action, {
      duration,
      panelClass: [panelClass],
      verticalPosition: 'top'
    });

    snackBarRef.onAction().subscribe(() => {
      if (this.currentPlan && action !== 'Fermer') {
        this.openPaymentDialog(this.currentPlan);
      }
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(`✅ ${message}`, 'Fermer', {
      duration: 5000,
      panelClass: ['success-snackbar'],
      verticalPosition: 'top'
    });
  }

  private showError(message: string): void {
    this.snackBar.open(`⚠️ ${message}`, 'Fermer', {
      duration: 5000,
      panelClass: ['warning-snackbar'],
      verticalPosition: 'top'
    });
  }
}