import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
})
export class ForgetPasswordComponent {
  email: string = '';
  message: string | null = null; 
  isError: boolean = false; 

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onResetPassword() {
    this.message = null; // Reset the message
    this.isError = false; // Reset the error state
  
    if (!this.email) {
      this.message = 'Veuillez entrer une adresse email valide.';
      this.isError = true;
      return;
    }
  
    this.authService.forgotPassword(this.email).subscribe(
      (response) => {
        console.log('Réponse du serveur :', response);
        const verificationCode = response.verificationCode; // Get the verification code
  
        // Store the verification code for later comparison
        localStorage.setItem('verificationCode', verificationCode);
        this.authService.setTemporaryEmail(this.email);
  
        // Display a success message
        this.message = response.message || 'Un code de vérification a été envoyé à votre adresse email.';
        this.isError = false;
  
        // Redirect the user to the verification page
        setTimeout(() => {
          this.router.navigate(['/verify-code']);
        }, 3000); // Redirect after 3 seconds
      },
      (error) => {
        console.error('Erreur :', error);
        this.message = error.error?.message || 'Une erreur s\'est produite lors de l\'envoi de l\'email.';
        this.isError = true;
      }
    );
  }
}