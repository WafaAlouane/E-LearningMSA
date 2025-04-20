import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf, NgClass } from '@angular/common';
import { RouterLink, Router } from '@angular/router'; // Import Router
import { AuthService } from '../../service/auth.service'; // Import AuthService

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, CommonModule, NgIf, NgClass, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  message: string = '';
  isError: boolean = false;
  newPassword: string = '';
  confirmPassword: string = '';
  email: string = '';

  constructor(
    private authService: AuthService, // Inject AuthService
    private router: Router // Inject Router
  ) {}
  ngOnInit() {
    
    this.email = this.authService.getTemporaryEmail() || '';}

  onResetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.message = 'Les mots de passe ne correspondent pas.';
      this.isError = true;
      return;
    }

    this.authService.resetPassword(this.email, this.newPassword, this.confirmPassword).subscribe(
      (response: any) => {
        this.message = response.message || 'Mot de passe réinitialisé avec succès.';
        this.isError = false;
        
        this.authService.setTemporaryEmail('');


        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      (error: any) => {
        console.error('Erreur :', error);
        this.message = error.error?.message || 'Une erreur s\'est produite lors de la réinitialisation du mot de passe.';
        this.isError = true;
      }
    );
  }
}