import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.scss'],
})
export class VerifyCodeComponent {
  code: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onVerifyCode() {
    const storedCode = localStorage.getItem('verificationCode'); 

    if (!storedCode || this.code !== storedCode) {
      alert('Code de vérification invalide.');
      return;
    }

    
    this.router.navigate(['/reset-password']);
  }
}