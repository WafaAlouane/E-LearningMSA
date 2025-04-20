import { Component, OnInit } from '@angular/core';
import { SubscriptionService, SubscriptionPlan } from '../../service/subscription.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaymentFormComponent } from '../payment-form/payment-form.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MaterialModule } from '../../../../app/material.module';
import { Router } from '@angular/router'; // Ajouté

@Component({
  standalone: true,
  selector: 'app-subscription-plans',
  templateUrl: './subscription-plans.component.html',
  styleUrls: ['./subscription-plans.component.scss'],
  imports: [
    MaterialModule,
    CommonModule,
    CurrencyPipe,
    PaymentFormComponent
  ]
})
export class SubscriptionPlansComponent implements OnInit {
  plans: SubscriptionPlan[] = [];
  loading = true;

  constructor(
    private subscriptionService: SubscriptionService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router // Ajouté
  ) { }

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.subscriptionService.getPlans().subscribe(
      plans => {
        this.plans = plans;
        this.loading = false;
      },
      error => {
        this.snackBar.open('Erreur lors du chargement des abonnements', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    );
  }

  subscribe(plan: SubscriptionPlan): void {
    // Vérifier si l'utilisateur est connecté
    const userData = localStorage.getItem('user');
    if (!userData) {
      // Si non connecté, rediriger vers la page de login
      this.snackBar.open('Veuillez vous connecter pour souscrire à un abonnement', 'Fermer', { duration: 3000 });
      this.router.navigate(['/login']);
      return;
    }

    // Si connecté, ouvrir le formulaire de paiement
    const dialogRef = this.dialog.open(PaymentFormComponent, {
      width: '500px',
      data: { plan }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Abonnement créé avec succès', 'Fermer', { duration: 3000 });
      }
    });
  }
}