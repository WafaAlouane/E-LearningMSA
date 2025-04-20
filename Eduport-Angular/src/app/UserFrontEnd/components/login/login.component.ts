import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, UntypedFormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FormsModule, ReactiveFormsModule, RouterModule, CommonModule, NgIf, NgClass]
})
export class LoginComponent {
  signinForm!: UntypedFormGroup;
  submitted: boolean = false;
  passwordType: boolean = true;
  message: string = '';
  isError: boolean = false;

  constructor(private authService: AuthService, private router: Router, private fb: UntypedFormBuilder) {
    this.signinForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  get form() {
    return this.signinForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
  
    if (this.signinForm.invalid) {
      this.message = 'Please fill in all required fields.';
      this.isError = true;
      return;
    }
  
    const username = this.signinForm.value.username;
    const password = this.signinForm.value.password;
  
    // Vérification spécifique pour l'admin
    if (username === 'admin' && password === 'admin1234') {
      this.router.navigate(['/admin']); // Redirection vers /admin
      return; // Arrête l'exécution de la méthode
    }
  
    // Appel normal au service d'authentification
    this.authService.login(this.signinForm.value).subscribe({
      next: (response) => {
        console.log('Login successful!', response);
        localStorage.setItem('accessToken', response.accessToken); 
        localStorage.setItem('user', JSON.stringify(response)); 
        this.message = 'Login successful! Redirecting...';
        this.isError = false;
  
        // Extraire les rôles de la réponse
        const roles = response.roles;
  
        // Rediriger en fonction du rôle
        if (roles.includes('TUTOR')) {
          this.router.navigate(['/instructor/dashboard']); 
        } else if (roles.includes('STUDENT')) {
          this.router.navigate(['/student/dashboard']); 
        } else if (roles.includes('PARTNER')) {
          this.router.navigate(['/student/dashboard']); 
        } else {
          this.router.navigate(['/dashboard']); 
        }
      },
      error: (error) => {
        console.error('Login failed', error);
        this.message = error.error?.message || 'Login failed. Please check your credentials.';
        this.isError = true;
      },
    });
  }
}