import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { SubscriptionService } from '../../service/subscription.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MaterialModule } from '../../../../app/material.module';
import { StripeElementsDirective, StripeCardComponent as StripeCard } from 'ngx-stripe';
import { NgbAccordionModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

interface PaymentDialogData {
  plan: any;
  userId: number;
}

interface DialogResult {
  success: boolean;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
}

@Component({
  standalone: true,
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss'],
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
    CurrencyPipe,
    StripeElementsDirective,
    StripeCard,
    NgbAccordionModule
  ]
})
export class PaymentFormComponent implements OnInit {
  @ViewChild(StripeCardComponent) card!: StripeCardComponent;
  paymentForm: FormGroup;
  loading = false;
  paymentError: string | null = null;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

  elementsOptions: StripeElementsOptions = { locale: 'fr' };

  constructor(
    private fb: FormBuilder,
    private stripeService: StripeService,
    private subscriptionService: SubscriptionService,
    public dialogRef: MatDialogRef<PaymentFormComponent, DialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: PaymentDialogData,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.paymentForm = this.fb.group({
      name: ['', [Validators.required]],
      autoRenew: [false]
    });
  }

  ngOnInit(): void {}

  createToken(): void {
    this.paymentError = null;
    
    if (!this.card) {
      this.paymentError = 'Veuillez compléter les détails de la carte';
      return;
    }

    if (this.paymentForm.invalid) {
      this.paymentError = 'Veuillez remplir tous les champs requis';
      return;
    }

    this.loading = true;
    const name = this.paymentForm.get('name')?.value;
    
    this.stripeService.createToken(this.card.element, { name }).subscribe({
      next: (result) => {
        if (result.token) {
          this.processPayment(result.token.id);
        } else if (result.error) {
          this.handleStripeError(result.error);
        }
      },
      error: () => this.handleError('Erreur de connexion au service de paiement')
    });
  }

  private processPayment(token: string): void {
    const { userId, plan } = this.data;
    const autoRenew = this.paymentForm.get('autoRenew')?.value;
    
    this.subscriptionService.createSubscription(
      userId,
      plan.id,
      token,
      autoRenew
    ).subscribe({
      next: () => {
        this.dialogRef.close({ 
          success: true,
          message: 'Paiement réussi - Abonnement activé'
        });
        // Redirection vers index-3 après la fermeture du dialogue
        this.router.navigate(['/index-3']);
      },
      error: (err) => this.handleBackendError(err)
    });
  }

  private handleStripeError(error: any): void {
    this.loading = false;
    const errorDetails = this.parseStripeError(error);
    this.paymentError = errorDetails.message;
  }

  private handleBackendError(error: any): void {
    this.loading = false;
    
    if (error.code && error.message) {
      this.dialogRef.close({
        success: false,
        error: {
          code: error.code,
          message: this.translatePaymentError(error),
          details: error.details
        }
      });
      return;
    }

    const errorDetails = this.parseBackendError(error.message || error.toString());
    this.dialogRef.close({
      success: false,
      error: {
        code: errorDetails.code,
        message: this.translatePaymentError(errorDetails)
      }
    });
  }

  private handleError(message: string): void {
    this.loading = false;
    this.paymentError = message;
  }

  private parseStripeError(error: any): { code: string; message: string } {
    const defaultMessage = 'Erreur lors du traitement de la carte';
    
    switch(error.code) {
      case 'incomplete_number': 
        return { code: error.code, message: 'Numéro de carte incomplet' };
      case 'invalid_number': 
        return { code: error.code, message: 'Numéro de carte invalide' };
      case 'card_declined':
        return { 
          code: error.code, 
          message: `Carte refusée: ${this.getDeclineReason(error.decline_code)}`
        };
      case 'insufficient_funds':
        return { code: error.code, message: 'Fonds insuffisants' };
      case 'expired_card':
        return { code: error.code, message: 'Carte expirée' };
      default:
        return { 
          code: error.code || 'stripe_error', 
          message: error.message || defaultMessage 
        };
    }
  }

  private parseBackendError(message: string): { code: string; message: string } {
    if (message.includes('card was declined')) {
      return { code: 'card_declined', message: 'Carte refusée par votre banque' };
    }
    if (message.includes('insufficient funds')) {
      return { code: 'insufficient_funds', message: 'Fonds insuffisants' };
    }
    if (message.includes('expired card')) {
      return { code: 'expired_card', message: 'Carte expirée' };
    }
    if (message.includes('User not found')) {
      return { code: 'user_not_found', message: 'Utilisateur non trouvé' };
    }
    if (message.includes('Plan not found')) {
      return { code: 'plan_not_found', message: 'Abonnement non trouvé' };
    }
    return { code: 'payment_error', message: message || 'Erreur de paiement' };
  }

  private translatePaymentError(error: { code: string; message: string }): string {
    const translations: Record<string, string> = {
      'card_declined': 'Votre carte a été refusée',
      'insufficient_funds': 'Fonds insuffisants sur votre carte',
      'expired_card': 'Votre carte a expiré',
      'invalid_cvc': 'Code de sécurité invalide',
      'invalid_number': 'Numéro de carte invalide',
      'user_not_found': 'Utilisateur non trouvé',
      'plan_not_found': 'Abonnement non trouvé',
      'payment_error': 'Erreur lors du traitement du paiement',
      'stripe_error': 'Erreur de traitement de la carte'
    };

    return translations[error.code] || error.message;
  }

  private getDeclineReason(declineCode?: string): string {
    const reasons: Record<string, string> = {
      'call_issuer': 'Contactez votre banque',
      'card_not_supported': 'Carte non supportée',
      'do_not_honor': 'Transaction refusée',
      'generic_decline': 'Refus générique',
      'lost_card': 'Carte perdue',
      'stolen_card': 'Carte volée'
    };
    return declineCode ? reasons[declineCode] || 'Raison inconnue' : 'Raison non spécifiée';
  }
}